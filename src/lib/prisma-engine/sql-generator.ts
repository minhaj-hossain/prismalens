// =============================================================================
// PRISMA TO RAW SQL GENERATOR & SQL LENS ENGINE
// =============================================================================

export interface GeneratedSqlOutput {
  rawSql: string;
  parameters: any[];
  executionPlan: string;
  isIndexScan: boolean;
  warnings?: string[];
  durationMs: number;
}

export function generateSqlFromPrismaCall(
  model: string,
  action: string,
  args: any = {}
): GeneratedSqlOutput {
  const tableName = model.toLowerCase() + 's';
  const alias = model[0].toLowerCase();
  let sql = '';
  const parameters: any[] = [];
  let paramIdx = 1;
  let isIndexScan = false;
  const warnings: string[] = [];

  // Determine fields to select
  let selectClause = `${alias}.*`;
  if (args.select) {
    const selectedFields = Object.keys(args.select).filter(k => args.select[k] === true);
    if (selectedFields.length > 0) {
      selectClause = selectedFields.map(f => `${alias}.${f}`).join(', ');
    }
  }

  // Determine joins or secondary queries for include
  const joins: string[] = [];
  if (args.include) {
    const includedRelations = Object.keys(args.include).filter(k => Boolean(args.include[k]));
    for (const rel of includedRelations) {
      const relTable = rel.toLowerCase();
      const relAlias = rel[0].toLowerCase();
      joins.push(`LEFT JOIN "${relTable}" ${relAlias} ON ${relAlias}."${model.toLowerCase()}Id" = ${alias}."id"`);
      warnings.push(`Prisma handles '${rel}' eager-loading via batched relation loading (WHERE "${model.toLowerCase()}Id" IN (...)) to prevent N+1 query loops.`);
    }
  }

  // Where clause
  const whereClauses: string[] = [];
  if (args.where) {
    parseWhereConditions(args.where, alias, whereClauses, parameters, paramIdx);
    paramIdx = parameters.length + 1;

    // Check if searching on primary key or unique index
    if (args.where.id || args.where.email || args.where.sku) {
      isIndexScan = true;
    }
  }

  // Order by
  let orderClause = '';
  if (args.orderBy) {
    if (Array.isArray(args.orderBy)) {
      const orders = args.orderBy.map((o: any) => {
        const field = Object.keys(o)[0];
        const dir = (o[field] || 'asc').toUpperCase();
        return `${alias}."${field}" ${dir}`;
      });
      orderClause = `ORDER BY ${orders.join(', ')}`;
    } else {
      const field = Object.keys(args.orderBy)[0];
      const dir = (args.orderBy[field] || 'asc').toUpperCase();
      orderClause = `ORDER BY ${alias}."${field}" ${dir}`;
    }
  }

  // Pagination
  let limitClause = '';
  if (action === 'findUnique' || action === 'findFirst') {
    limitClause = 'LIMIT 1';
  } else if (args.take) {
    limitClause = `LIMIT ${args.take}`;
  }

  let offsetClause = '';
  if (args.skip) {
    offsetClause = `OFFSET ${args.skip}`;
  }

  if (action.startsWith('find')) {
    sql = `SELECT ${selectClause}\nFROM "${tableName}" AS ${alias}`;
    if (joins.length > 0) {
      sql += '\n' + joins.join('\n');
    }
    if (whereClauses.length > 0) {
      sql += '\nWHERE ' + whereClauses.join(' AND ');
    }
    if (orderClause) {
      sql += '\n' + orderClause;
    }
    if (limitClause) {
      sql += '\n' + limitClause;
    }
    if (offsetClause) {
      sql += '\n' + offsetClause;
    }
    sql += ';';
  } else if (action === 'create') {
    const data = args.data || {};
    const cols = Object.keys(data).filter(k => typeof data[k] !== 'object');
    const placeholders = cols.map((col) => {
      parameters.push(data[col]);
      return `$${parameters.length}`;
    });
    sql = `INSERT INTO "${tableName}" ("${cols.join('", "')}")\nVALUES (${placeholders.join(', ')})\nRETURNING *;`;
  } else if (action === 'createMany') {
    const records = Array.isArray(args.data) ? args.data : [args.data];
    sql = `INSERT INTO "${tableName}" (...) VALUES ${records.length} row(s)${args.skipDuplicates ? ' ON CONFLICT DO NOTHING' : ''} RETURNING *;`;
  } else if (action === 'update') {
    const data = args.data || {};
    const setClauses: string[] = [];
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'object' && val !== null) {
        if ('increment' in val) {
          setClauses.push(`"${key}" = "${key}" + ${(val as any).increment}`);
        } else if ('decrement' in val) {
          setClauses.push(`"${key}" = "${key}" - ${(val as any).decrement}`);
        }
      } else {
        parameters.push(val);
        setClauses.push(`"${key}" = $${parameters.length}`);
      }
    }
    if (whereClauses.length === 0 && args.where) {
      parseWhereConditions(args.where, tableName, whereClauses, parameters, parameters.length + 1);
    }
    sql = `UPDATE "${tableName}"\nSET ${setClauses.join(', ')}\nWHERE ${whereClauses.join(' AND ')}\nRETURNING *;`;
  } else if (action === 'upsert') {
    sql = `INSERT INTO "${tableName}" (...) VALUES (...)\nON CONFLICT (${Object.keys(args.where || {}).join(', ')})\nDO UPDATE SET ...\nRETURNING *;`;
  } else if (action === 'delete') {
    if (whereClauses.length === 0 && args.where) {
      parseWhereConditions(args.where, tableName, whereClauses, parameters, parameters.length + 1);
    }
    sql = `DELETE FROM "${tableName}"\nWHERE ${whereClauses.join(' AND ')}\nRETURNING *;`;
  } else {
    sql = `-- Executed Prisma action: ${action} on model ${model}\nSELECT * FROM "${tableName}";`;
  }

  // Simulated execution plan & realistic sub-millisecond execution duration
  const executionPlan = isIndexScan
    ? `-> Index Scan using ${tableName}_pkey on ${tableName} (cost=0.15..8.17 rows=1 width=128)`
    : `-> Seq Scan on ${tableName} (cost=0.00..18.50 rows=100 width=128)`;

  const durationMs = Number((Math.random() * 1.8 + 0.4).toFixed(2));

  return {
    rawSql: sql,
    parameters,
    executionPlan,
    isIndexScan,
    warnings: warnings.length > 0 ? warnings : undefined,
    durationMs
  };
}

function parseWhereConditions(
  where: any,
  alias: string,
  clauses: string[],
  parameters: any[],
  startParamIdx: number
) {
  for (const [key, val] of Object.entries(where)) {
    if (key === 'AND' && Array.isArray(val)) {
      const subClauses: string[] = [];
      for (const sub of val) {
        parseWhereConditions(sub, alias, subClauses, parameters, parameters.length + 1);
      }
      if (subClauses.length > 0) {
        clauses.push(`(${subClauses.join(' AND ')})`);
      }
      continue;
    }

    if (key === 'OR' && Array.isArray(val)) {
      const subClauses: string[] = [];
      for (const sub of val) {
        parseWhereConditions(sub, alias, subClauses, parameters, parameters.length + 1);
      }
      if (subClauses.length > 0) {
        clauses.push(`(${subClauses.join(' OR ')})`);
      }
      continue;
    }

    if (typeof val === 'object' && val !== null) {
      const obj = val as Record<string, any>;
      if ('gte' in obj) {
        parameters.push(obj.gte);
        clauses.push(`${alias}."${key}" >= $${parameters.length}`);
      }
      if ('lte' in obj) {
        parameters.push(obj.lte);
        clauses.push(`${alias}."${key}" <= $${parameters.length}`);
      }
      if ('gt' in obj) {
        parameters.push(obj.gt);
        clauses.push(`${alias}."${key}" > $${parameters.length}`);
      }
      if ('lt' in obj) {
        parameters.push(obj.lt);
        clauses.push(`${alias}."${key}" < $${parameters.length}`);
      }
      if ('contains' in obj) {
        parameters.push(`%${obj.contains}%`);
        if (obj.mode === 'insensitive') {
          clauses.push(`${alias}."${key}" ILIKE $${parameters.length}`);
        } else {
          clauses.push(`${alias}."${key}" LIKE $${parameters.length}`);
        }
      }
      if ('in' in obj && Array.isArray(obj.in)) {
        const placeHolders = obj.in.map((item: any) => {
          parameters.push(item);
          return `$${parameters.length}`;
        });
        clauses.push(`${alias}."${key}" IN (${placeHolders.join(', ')})`);
      }
    } else {
      parameters.push(val);
      clauses.push(`${alias}."${key}" = $${parameters.length}`);
    }
  }
}
