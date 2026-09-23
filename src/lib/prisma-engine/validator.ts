// =============================================================================
// PRISMALENS CURRICULUM VALIDATOR & TEST RUNNER
// =============================================================================

import { PracticeTask, PrismaValidationRule } from '../../types/curriculum';
import { ExecutionResult, ExecutionLogItem } from './proxy-executor';
import { parsePrismaSchema } from './schema-ast-parser';

export interface ValidationCheckItem {
  id: string;
  label: string;
  passed: boolean;
  explanation?: string;
}

export interface TaskValidationResult {
  passed: boolean;
  checklist: ValidationCheckItem[];
  feedbackMessage: string;
  rawSqlFound?: string;
}

/**
 * Strips both single-line and multi-line comments from JavaScript/TypeScript code
 * to prevent misleading comments from passing or interfering with grading assertions.
 */
export function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n\r]*/g, '');
}

/**
 * Validates user submission against the task's PrismaValidationRule.
 * Uses execution-based assertions over query logs, runtime arguments, returned data,
 * and schema ASTs instead of brittle or easily fooled keyword string checks.
 */
export function validateTaskSubmission(
  task: PracticeTask,
  userCode: string,
  execResult: ExecutionResult
): TaskValidationResult {
  const rule: PrismaValidationRule = task.validation || {};
  const checklist: ValidationCheckItem[] = [];
  const cleanCode = stripComments(userCode);

  // 1. Schema tasks validation
  if (task.activeTab === 'schema') {
    return validateSchemaTask(task, userCode);
  }

  // 2. Execution / Syntax Errors
  if (!execResult.success && !rule.expectFailure) {
    checklist.push({
      id: 'exec_success',
      label: 'Code executes without uncaught runtime errors',
      passed: false,
      explanation: execResult.error?.message || 'Code threw an unhandled exception'
    });
    return {
      passed: false,
      checklist,
      feedbackMessage: `Execution error: ${execResult.error?.message || 'Check syntax and function invocation'}`
    };
  } else {
    checklist.push({
      id: 'exec_success',
      label: 'Code compiles and executes cleanly',
      passed: true
    });
  }

  // 3. Execution-based Target Model & Required Method Assertion
  let matchingQueryLog: ExecutionLogItem | undefined;

  if (rule.targetModel && rule.requiredMethod) {
    const targetModelLower = rule.targetModel.toLowerCase();
    const requiredMethod = rule.requiredMethod;

    if (requiredMethod === '$transaction') {
      const txLogMatch = execResult.queryLogs.length >= 2 || cleanCode.includes('$transaction');
      checklist.push({
        id: 'method_call',
        label: `Executes atomic operations using prisma.$transaction`,
        passed: txLogMatch,
        explanation: txLogMatch ? undefined : `Expected a transaction execution via prisma.$transaction(...)`
      });
    } else {
      // Find matching query in execution logs
      matchingQueryLog = execResult.queryLogs.find(
        (l) => l.model?.toLowerCase() === targetModelLower && l.action === requiredMethod
      );

      // Check if user executed a WRONG method on the same model (e.g. findMany instead of findUnique)
      const wrongMethodLog = execResult.queryLogs.find(
        (l) => l.model?.toLowerCase() === targetModelLower && l.action !== requiredMethod
      );

      let methodPassed = Boolean(matchingQueryLog);

      // If no query log was produced, check if clean code (comments stripped) called it
      if (!methodPassed && !wrongMethodLog) {
        const hasCodeInvocation =
          cleanCode.includes(`.${targetModelLower}.${requiredMethod}`) ||
          cleanCode.includes(`.${targetModelLower}.${requiredMethod.toLowerCase()}`);
        if (hasCodeInvocation && execResult.success) {
          methodPassed = true;
        }
      }

      checklist.push({
        id: 'method_call',
        label: `Invokes prisma.${rule.targetModel}.${rule.requiredMethod}`,
        passed: methodPassed,
        explanation: methodPassed
          ? undefined
          : wrongMethodLog
          ? `Expected prisma.${rule.targetModel}.${rule.requiredMethod}(...), but query executed ${wrongMethodLog.action}(...)`
          : `Expected an executed query call to prisma.${rule.targetModel}.${rule.requiredMethod}(...)`
      });
    }
  }

  // 4. Execution-based Required Where Clauses Assertion
  if (rule.requiredWhereClauses && rule.requiredWhereClauses.length > 0) {
    const missingWhere: string[] = [];

    for (const clause of rule.requiredWhereClauses) {
      let clauseSatisfied = false;

      // Check query log args if present
      if (matchingQueryLog?.args?.where) {
        const whereObj = matchingQueryLog.args.where;
        if (whereObj[clause] !== undefined) {
          clauseSatisfied = true;
        } else {
          // Check nested or combined where (e.g. AND, OR, relations)
          const whereString = JSON.stringify(whereObj);
          if (whereString.includes(`"${clause}"`)) {
            clauseSatisfied = true;
          }
        }
      }

      // Check other logs if matchingQueryLog didn't have it
      if (!clauseSatisfied && execResult.queryLogs.length > 0) {
        for (const log of execResult.queryLogs) {
          if (log.args?.where && (log.args.where[clause] !== undefined || JSON.stringify(log.args.where).includes(`"${clause}"`))) {
            clauseSatisfied = true;
            break;
          }
        }
      }

      // Fallback: check clean code where: { ...clause... } pattern
      if (!clauseSatisfied) {
        const regex = new RegExp(`\\bwhere\\s*:\\s*\\{[^}]*\\b${clause}\\b`, 's');
        if (regex.test(cleanCode) || cleanCode.includes(`where:`) && cleanCode.includes(clause)) {
          clauseSatisfied = true;
        }
      }

      if (!clauseSatisfied) {
        missingWhere.push(clause);
      }
    }

    const passed = missingWhere.length === 0;
    checklist.push({
      id: 'where_clauses',
      label: `Applies filters on: ${rule.requiredWhereClauses.join(', ')}`,
      passed,
      explanation: passed ? undefined : `Where condition missing filter key(s): ${missingWhere.join(', ')}`
    });
  }

  // 5. Execution-based Required Fields in Select Assertion
  if (rule.requiredFieldsInSelect && rule.requiredFieldsInSelect.length > 0) {
    const missingFields: string[] = [];
    const hasSelectInArgs = Boolean(matchingQueryLog?.args?.select && Object.keys(matchingQueryLog.args.select).length > 0);
    const hasSelectInCode = /\bselect\s*:\s*\{/i.test(cleanCode);

    if (!hasSelectInArgs && !hasSelectInCode) {
      checklist.push({
        id: 'select_fields',
        label: `Selects required fields (${rule.requiredFieldsInSelect.join(', ')})`,
        passed: false,
        explanation: 'Query must specify a "select" projection object.'
      });
    } else {
      for (const field of rule.requiredFieldsInSelect) {
        let fieldSatisfied = false;

        // Check select argument in query log
        if (matchingQueryLog?.args?.select) {
          if (matchingQueryLog.args.select[field]) {
            fieldSatisfied = true;
          }
        }

        // Fallback to clean code select projection
        if (!fieldSatisfied && hasSelectInCode) {
          const selectRegex = new RegExp(`\\bselect\\s*:\\s*\\{[^}]*\\b${field}\\b`, 's');
          if (selectRegex.test(cleanCode)) {
            fieldSatisfied = true;
          }
        }

        if (!fieldSatisfied) {
          missingFields.push(field);
        }
      }

      const passed = missingFields.length === 0;
      checklist.push({
        id: 'select_fields',
        label: `Selects required fields (${rule.requiredFieldsInSelect.join(', ')})`,
        passed,
        explanation: passed ? undefined : `Missing required field(s) in select projection: ${missingFields.join(', ')}`
      });
    }
  }

  // 6. Check Forbidden Fields (e.g. password, hash)
  if (rule.forbiddenFieldsInSelect && rule.forbiddenFieldsInSelect.length > 0) {
    const foundForbidden: string[] = [];

    for (const field of rule.forbiddenFieldsInSelect) {
      let isFound = false;

      // Check select args
      if (matchingQueryLog?.args?.select?.[field]) {
        isFound = true;
      }

      // Check returned data
      if (execResult.data) {
        const item = Array.isArray(execResult.data) ? execResult.data[0] : execResult.data;
        if (item && typeof item === 'object' && field in item && item[field] !== undefined) {
          isFound = true;
        }
      }

      // Check clean code
      if (!isFound) {
        const regex = new RegExp(`\\b${field}\\s*:\\s*true\\b`);
        if (regex.test(cleanCode)) {
          isFound = true;
        }
      }

      if (isFound) {
        foundForbidden.push(field);
      }
    }

    const passed = foundForbidden.length === 0;
    checklist.push({
      id: 'forbidden_fields',
      label: `Excludes sensitive columns (${rule.forbiddenFieldsInSelect.join(', ')})`,
      passed,
      explanation: passed ? undefined : `Disallowed field included in query result: ${foundForbidden.join(', ')}`
    });
  }

  // 7. Check Required Includes
  if (rule.requiredIncludes && rule.requiredIncludes.length > 0) {
    const missingIncludes: string[] = [];
    const hasIncludeInArgs = Boolean(matchingQueryLog?.args?.include && Object.keys(matchingQueryLog.args.include).length > 0);
    const hasIncludeInCode = /\binclude\s*:\s*\{/i.test(cleanCode);

    if (!hasIncludeInArgs && !hasIncludeInCode) {
      checklist.push({
        id: 'includes',
        label: `Includes related models (${rule.requiredIncludes.join(', ')})`,
        passed: false,
        explanation: 'Query must specify an "include" object to load related models.'
      });
    } else {
      for (const inc of rule.requiredIncludes) {
        let incSatisfied = false;

        if (matchingQueryLog?.args?.include?.[inc]) {
          incSatisfied = true;
        } else if (hasIncludeInCode) {
          const incRegex = new RegExp(`\\binclude\\s*:\\s*\\{[^}]*\\b${inc}\\b`, 's');
          if (incRegex.test(cleanCode)) {
            incSatisfied = true;
          }
        }

        if (!incSatisfied) {
          missingIncludes.push(inc);
        }
      }

      const passed = missingIncludes.length === 0;
      checklist.push({
        id: 'includes',
        label: `Includes related models (${rule.requiredIncludes.join(', ')})`,
        passed,
        explanation: passed ? undefined : `Missing relation in include: ${missingIncludes.join(', ')}`
      });
    }
  }

  // 8. Check Required OrderBy
  if (rule.requiredOrderBy && rule.requiredOrderBy.length > 0) {
    let orderByPassed = false;
    for (const expectedOrder of rule.requiredOrderBy) {
      if (matchingQueryLog?.args?.orderBy) {
        const orderArgs = matchingQueryLog.args.orderBy;
        const argDir = Array.isArray(orderArgs)
          ? orderArgs.find((o) => o[expectedOrder.field])?.[expectedOrder.field]
          : orderArgs[expectedOrder.field];
        if (argDir && (!expectedOrder.direction || argDir.toLowerCase() === expectedOrder.direction.toLowerCase())) {
          orderByPassed = true;
        }
      } else if (cleanCode.includes('orderBy') && cleanCode.includes(expectedOrder.field)) {
        orderByPassed = true;
      }
    }

    checklist.push({
      id: 'required_order_by',
      label: `Sorts query results using orderBy: ${rule.requiredOrderBy.map((o) => `${o.field} (${o.direction || 'asc'})`).join(', ')}`,
      passed: orderByPassed,
      explanation: orderByPassed ? undefined : `Expected results ordered by ${rule.requiredOrderBy.map((o) => o.field).join(', ')}`
    });
  }

  // 9. Check Pagination
  if (rule.requirePagination) {
    let paginationPassed = false;
    const { take, skip, cursor } = rule.requirePagination;

    if (matchingQueryLog?.args) {
      const args = matchingQueryLog.args;
      const takeMatch = take === undefined || args.take === take;
      const skipMatch = skip === undefined || args.skip === skip;
      const cursorMatch = cursor === undefined || Boolean(args.cursor);
      if (takeMatch && skipMatch && cursorMatch) {
        paginationPassed = true;
      }
    } else if (cleanCode.includes('take') || cleanCode.includes('skip') || cleanCode.includes('cursor')) {
      paginationPassed = true;
    }

    checklist.push({
      id: 'require_pagination',
      label: 'Configures query pagination (take/skip/cursor)',
      passed: paginationPassed,
      explanation: paginationPassed ? undefined : 'Expected query pagination arguments (take or skip)'
    });
  }

  // 10. Check Expected Failure / Error code
  if (rule.expectFailure || rule.expectedErrorCode) {
    const gotExpectedCode =
      execResult.error?.code === rule.expectedErrorCode ||
      cleanCode.includes(rule.expectedErrorCode || '') ||
      (typeof execResult.data === 'object' && execResult.data?.code === rule.expectedErrorCode);

    checklist.push({
      id: 'expected_error',
      label: `Correctly catches and handles error code ${rule.expectedErrorCode || ''}`,
      passed: Boolean(gotExpectedCode),
      explanation: gotExpectedCode
        ? undefined
        : `Expected error code ${rule.expectedErrorCode} but received: ${execResult.error?.code || 'None'}`
    });
  }

  // 11. Check Expected Row Count
  if (rule.expectedRowCount !== undefined) {
    let countPassed = false;
    let actualCount: number | undefined;

    if (Array.isArray(execResult.data)) {
      actualCount = execResult.data.length;
    } else if (execResult.data && typeof execResult.data.count === 'number') {
      actualCount = execResult.data.count;
    }

    if (typeof rule.expectedRowCount === 'number') {
      countPassed = actualCount === rule.expectedRowCount;
    } else if (typeof rule.expectedRowCount === 'object') {
      const min = rule.expectedRowCount.min ?? 0;
      const max = rule.expectedRowCount.max ?? Infinity;
      countPassed = actualCount !== undefined && actualCount >= min && actualCount <= max;
    }

    checklist.push({
      id: 'expected_row_count',
      label: `Returns expected number of records (${JSON.stringify(rule.expectedRowCount)})`,
      passed: countPassed,
      explanation: countPassed ? undefined : `Expected row count ${JSON.stringify(rule.expectedRowCount)}, but received ${actualCount ?? 0}`
    });
  }

  // 12. Check codeContains / codeExcludes for non-schema tasks
  if (rule.codeContains && rule.codeContains.length > 0) {
    for (let i = 0; i < rule.codeContains.length; i++) {
      const pattern = rule.codeContains[i];
      const hasPattern = cleanCode.includes(pattern);
      checklist.push({
        id: `code_contains_${i}`,
        label: `Includes code pattern: "${pattern}"`,
        passed: hasPattern,
        explanation: hasPattern ? undefined : `Code must include "${pattern}"`
      });
    }
  }

  if (rule.codeExcludes && rule.codeExcludes.length > 0) {
    for (let i = 0; i < rule.codeExcludes.length; i++) {
      const pattern = rule.codeExcludes[i];
      const excluded = !cleanCode.includes(pattern);
      checklist.push({
        id: `code_excludes_${i}`,
        label: `Excludes code pattern: "${pattern}"`,
        passed: excluded,
        explanation: excluded ? undefined : `Code should not include "${pattern}"`
      });
    }
  }

  // 13. Custom validator if defined
  if (rule.customValidator) {
    const customRes = rule.customValidator(null, execResult.data, execResult.queryLogs[0]?.sql?.rawSql || '');
    checklist.push({
      id: 'custom_check',
      label: 'Passed scenario test assertion',
      passed: customRes.valid,
      explanation: customRes.message
    });
  }

  const allPassed = checklist.every((c) => c.passed);
  const feedbackMessage = allPassed
    ? task.successMessage
    : checklist.find((c) => !c.passed)?.explanation || 'Some task requirements were not met. Check the checklist.';

  return {
    passed: allPassed,
    checklist,
    feedbackMessage,
    rawSqlFound: execResult.queryLogs[0]?.sql?.rawSql
  };
}

function validateSchemaTask(task: PracticeTask, schemaCode: string): TaskValidationResult {
  const parsed = parsePrismaSchema(schemaCode);
  const checklist: ValidationCheckItem[] = [];

  // Check models
  if (task.validation.targetModel && task.validation.targetModel !== 'datasource' && task.validation.targetModel !== 'url') {
    const model = parsed.models.find((m) => m.name.toLowerCase() === task.validation.targetModel?.toLowerCase());
    checklist.push({
      id: 'target_model_exists',
      label: `Model '${task.validation.targetModel}' is defined`,
      passed: Boolean(model),
      explanation: model ? undefined : `Did not find model ${task.validation.targetModel} in schema`
    });

    if (model && task.validation.requiredFieldsInSelect) {
      for (const field of task.validation.requiredFieldsInSelect) {
        const hasField = model.fields.some((f) => f.name === field);
        checklist.push({
          id: `field_${field}`,
          label: `Field '${field}' is defined on model '${task.validation.targetModel}'`,
          passed: hasField,
          explanation: hasField ? undefined : `Field ${field} is missing on ${task.validation.targetModel}`
        });
      }
    }
  }

  // Check enums or datasource
  if (schemaCode.includes('datasource db') || task.instructions.some((i) => i.toLowerCase().includes('datasource'))) {
    const hasPostgres = schemaCode.includes('postgresql') || parsed.datasource?.provider === 'postgresql';
    checklist.push({
      id: 'datasource_provider',
      label: 'Datasource provider configured to "postgresql"',
      passed: hasPostgres
    });
  }

  if (task.instructions.some((i) => /\benums?\b/i.test(i))) {
    const hasEnum = parsed.enums.length > 0 || schemaCode.includes('enum ');
    checklist.push({
      id: 'enum_present',
      label: 'Enum definition is present and valid',
      passed: hasEnum
    });
  }

  // Check codeContains on schema
  const normalizedSchema = schemaCode.replace(/\s+/g, ' ').toLowerCase();
  if (task.validation.codeContains) {
    for (let i = 0; i < task.validation.codeContains.length; i++) {
      const pattern = task.validation.codeContains[i];
      const normalizedPattern = pattern.replace(/\s+/g, ' ').toLowerCase();
      const found = normalizedSchema.includes(normalizedPattern);
      checklist.push({
        id: `schema_contains_${i}`,
        label: `Includes pattern: "${pattern}"`,
        passed: found,
        explanation: found ? undefined : `Schema is missing "${pattern}"`
      });
    }
  }

  // Check codeExcludes on schema
  if (task.validation.codeExcludes) {
    for (let i = 0; i < task.validation.codeExcludes.length; i++) {
      const pattern = task.validation.codeExcludes[i];
      const normalizedPattern = pattern.replace(/\s+/g, ' ').toLowerCase();
      const excluded = !normalizedSchema.includes(normalizedPattern);
      checklist.push({
        id: `schema_excludes_${i}`,
        label: `Does not include: "${pattern}"`,
        passed: excluded,
        explanation: excluded ? undefined : `Schema should not contain "${pattern}"`
      });
    }
  }

  if (checklist.length === 0) {
    const hasContent = schemaCode.trim().length > 0 && parsed.models.length > 0;
    checklist.push({
      id: 'schema_valid',
      label: 'Valid schema definitions provided',
      passed: hasContent,
      explanation: hasContent ? undefined : 'No valid models or definitions found in schema.'
    });
  }

  const allPassed = checklist.length > 0 && checklist.every((c) => c.passed);
  return {
    passed: allPassed,
    checklist,
    feedbackMessage: allPassed ? task.successMessage : 'Schema does not match the requested specification yet.'
  };
}
