// =============================================================================
// PRISMA TASK VALIDATOR
// =============================================================================

import { PracticeTask, PrismaValidationRule } from '../../types/curriculum';
import { ExecutionResult } from './proxy-executor';
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

export function validateTaskSubmission(
  task: PracticeTask,
  userCode: string,
  execResult: ExecutionResult
): TaskValidationResult {
  const rule: PrismaValidationRule = task.validation;
  const checklist: ValidationCheckItem[] = [];
  const normalizedCode = userCode.replace(/\s+/g, ' ');

  // Schema tasks validation
  if (task.activeTab === 'schema') {
    return validateSchemaTask(task, userCode);
  }

  // 1. Check Execution / Syntax Errors
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

  // 2. Check Target Model & Required Method in query logs or AST/code
  if (rule.targetModel && rule.requiredMethod) {
    const logMatch = execResult.queryLogs.some(
      l => l.model.toLowerCase() === rule.targetModel?.toLowerCase() && l.action === rule.requiredMethod
    );
    const codeMatch = userCode.toLowerCase().includes(`.${rule.targetModel.toLowerCase()}.${rule.requiredMethod.toLowerCase()}`) ||
                      userCode.toLowerCase().includes(`prisma.${rule.targetModel.toLowerCase()}`);

    const methodPassed = logMatch || codeMatch;
    checklist.push({
      id: 'method_call',
      label: `Invokes prisma.${rule.targetModel}.${rule.requiredMethod}`,
      passed: methodPassed,
      explanation: methodPassed ? undefined : `Expected a call to prisma.${rule.targetModel}.${rule.requiredMethod}(...)`
    });
  }

  // 3. Check Required Fields in Select
  if (rule.requiredFieldsInSelect && rule.requiredFieldsInSelect.length > 0) {
    const missingFields: string[] = [];
    for (const field of rule.requiredFieldsInSelect) {
      const hasField = userCode.includes(field) && (userCode.includes('select') || userCode.includes(field));
      if (!hasField) {
        missingFields.push(field);
      }
    }
    const passed = missingFields.length === 0;
    checklist.push({
      id: 'select_fields',
      label: `Selects required fields (${rule.requiredFieldsInSelect.join(', ')})`,
      passed,
      explanation: passed ? undefined : `Missing fields in select: ${missingFields.join(', ')}`
    });
  }

  // 4. Check Forbidden Fields (e.g. password, hash)
  if (rule.forbiddenFieldsInSelect && rule.forbiddenFieldsInSelect.length > 0) {
    const foundForbidden: string[] = [];
    for (const field of rule.forbiddenFieldsInSelect) {
      if (userCode.includes(field)) {
        foundForbidden.push(field);
      }
    }
    const passed = foundForbidden.length === 0;
    checklist.push({
      id: 'forbidden_fields',
      label: `Excludes sensitive columns (${rule.forbiddenFieldsInSelect.join(', ')})`,
      passed,
      explanation: passed ? undefined : `Disallowed field included in query: ${foundForbidden.join(', ')}`
    });
  }

  // 5. Check Required Includes
  if (rule.requiredIncludes && rule.requiredIncludes.length > 0) {
    const missingIncludes: string[] = [];
    for (const inc of rule.requiredIncludes) {
      if (!userCode.includes(inc)) {
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

  // 6. Check Required Where Clauses
  if (rule.requiredWhereClauses && rule.requiredWhereClauses.length > 0) {
    const missingWhere: string[] = [];
    for (const clause of rule.requiredWhereClauses) {
      if (!userCode.includes(clause)) {
        missingWhere.push(clause);
      }
    }
    const passed = missingWhere.length === 0;
    checklist.push({
      id: 'where_clauses',
      label: `Applies filters on: ${rule.requiredWhereClauses.join(', ')}`,
      passed,
      explanation: passed ? undefined : `Where condition missing: ${missingWhere.join(', ')}`
    });
  }

  // 7. Check Expected Failure / Error code
  if (rule.expectFailure || rule.expectedErrorCode) {
    const gotExpectedCode = execResult.error?.code === rule.expectedErrorCode ||
      userCode.includes(rule.expectedErrorCode || '') ||
      (typeof execResult.data === 'object' && execResult.data?.code === rule.expectedErrorCode);
    checklist.push({
      id: 'expected_error',
      label: `Correctly catches and handles error code ${rule.expectedErrorCode || ''}`,
      passed: Boolean(gotExpectedCode),
      explanation: gotExpectedCode ? undefined : `Expected error code ${rule.expectedErrorCode} but received: ${execResult.error?.code || 'None'}`
    });
  }

  // 8. Custom validator if defined
  if (rule.customValidator) {
    const customRes = rule.customValidator(null, execResult.data, execResult.queryLogs[0]?.sql?.rawSql || '');
    checklist.push({
      id: 'custom_check',
      label: 'Passed scenario test assertion',
      passed: customRes.valid,
      explanation: customRes.message
    });
  }

  const allPassed = checklist.every(c => c.passed);
  const feedbackMessage = allPassed
    ? task.successMessage
    : (checklist.find(c => !c.passed)?.explanation || 'Some task requirements were not met. Check the checklist.');

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
    const model = parsed.models.find(m => m.name.toLowerCase() === task.validation.targetModel?.toLowerCase());
    checklist.push({
      id: 'target_model_exists',
      label: `Model '${task.validation.targetModel}' is defined`,
      passed: Boolean(model),
      explanation: model ? undefined : `Did not find model ${task.validation.targetModel} in schema`
    });

    if (model && task.validation.requiredFieldsInSelect) {
      for (const field of task.validation.requiredFieldsInSelect) {
        const hasField = model.fields.some(f => f.name === field);
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
  if (schemaCode.includes('datasource db') || task.instructions.some(i => i.toLowerCase().includes('datasource'))) {
    const hasPostgres = schemaCode.includes('postgresql') || parsed.datasource?.provider === 'postgresql';
    checklist.push({
      id: 'datasource_provider',
      label: 'Datasource provider configured to "postgresql"',
      passed: hasPostgres
    });
  }

  if (task.instructions.some(i => /\benums?\b/i.test(i))) {
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

  const allPassed = checklist.length > 0 && checklist.every(c => c.passed);
  return {
    passed: allPassed,
    checklist,
    feedbackMessage: allPassed ? task.successMessage : 'Schema does not match the requested specification yet.'
  };
}
