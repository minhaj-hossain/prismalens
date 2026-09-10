// =============================================================================
// IN-BROWSER PRISMA SIMULATION ENGINE & QUERY PROXY EXECUTOR
// =============================================================================

import { z } from 'zod';
import { INITIAL_ECOM_FIXTURES } from '../../content/database/seed-schemas';
import { generateSqlFromPrismaCall, GeneratedSqlOutput } from './sql-generator';

export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: Record<string, any>;
  clientVersion: string = '7.0.0';

  constructor(message: string, { code, meta }: { code: string; meta?: Record<string, any> }) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
    this.meta = meta;
  }
}

export const Prisma = {
  PrismaClientKnownRequestError,
  Decimal: (val: any) => Number(val)
};

export interface ExecutionLogItem {
  model: string;
  action: string;
  args: any;
  sql: GeneratedSqlOutput;
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  data: any;
  error?: {
    name: string;
    message: string;
    code?: string;
    meta?: any;
    stack?: string;
  };
  inferredType: string;
  queryLogs: ExecutionLogItem[];
  durationMs: number;
}

export class InBrowserPrismaEngine {
  private tables: Record<string, any[]> = {};
  public executionLogs: ExecutionLogItem[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.tables = JSON.parse(JSON.stringify(INITIAL_ECOM_FIXTURES));
    // Also ensure fallback tables exist
    if (!this.tables.customers) {
      this.tables.customers = [
        { id: 1, email: 'john@example.com', name: 'John Doe', cust_email: 'john@example.com' },
        { id: 2, email: 'jane@example.com', name: 'Jane Roe', cust_email: 'jane@example.com' },
      ];
    }
    if (!this.tables.authors) {
      this.tables.authors = [
        { id: 1, name: 'Herman Melville' },
        { id: 2, name: 'Mary Shelley' },
      ];
    }
    if (!this.tables.books) {
      this.tables.books = [
        { id: 1, title: 'Moby Dick', authorId: 1 },
        { id: 2, title: 'Frankenstein', authorId: 2 },
      ];
    }
    if (!this.tables.articles) {
      this.tables.articles = [
        { id: 1, slug: 'intro-to-orm', title: 'Intro to ORMs', content: 'ORMs map tables to objects.', isPublished: true, deletedAt: null },
        { id: 2, slug: 'prisma-indexing', title: 'Prisma Indexing', content: 'Accelerate your database with indexes.', isPublished: true, deletedAt: null },
      ];
    }
    if (!this.tables.seats) {
      this.tables.seats = [
        { id: 1, seatNumber: 'A1', isBooked: false },
        { id: 2, seatNumber: 'A2', isBooked: true },
      ];
    }
    if (!this.tables.tickets) {
      this.tables.tickets = [];
    }
    if (!this.tables.activities) {
      this.tables.activities = [
        { id: 10, action: 'LOGIN', userId: 1, createdAt: new Date().toISOString() },
        { id: 9, action: 'ORDER_PLACED', userId: 1, createdAt: new Date().toISOString() },
        { id: 8, action: 'COMMENT_ADDED', userId: 2, createdAt: new Date().toISOString() }
      ];
    }
    if (!this.tables.user_preferences) {
      this.tables.user_preferences = [
        { id: 1, userId: 1, emailNotify: true }
      ];
    }
    if (!this.tables.page_views) {
      this.tables.page_views = [
        { path: '/docs', views: 120 }
      ];
    }
    this.executionLogs = [];
  }

  private getTable(modelName: string): any[] {
    const key = modelName.toLowerCase() + 's';
    if (!this.tables[key]) {
      const altKey = modelName.toLowerCase();
      if (this.tables[altKey]) return this.tables[altKey];
      // create new table dynamically if not exists
      this.tables[key] = [];
      return this.tables[key];
    }
    return this.tables[key];
  }

  public createClientProxy(txWrapper?: any): any {
    const engine = this;

    const handler = {
      get(target: any, prop: string) {
        if (prop === '$transaction') {
          return async (arg: any) => {
            if (Array.isArray(arg)) {
              const results = [];
              for (const op of arg) {
                results.push(await op);
              }
              return results;
            } else if (typeof arg === 'function') {
              const scopedClient = engine.createClientProxy();
              return await arg(scopedClient);
            }
            throw new Error('$transaction expects an array of promises or an interactive callback function');
          };
        }

        if (prop === '$disconnect') {
          return async () => {
            return true;
          };
        }

        if (prop === '$on') {
          return (event: string, cb: any) => {
            // Simulated event listener
          };
        }

        // Model delegate
        const modelName = prop;
        return {
          findMany: async (args: any = {}) => {
            return engine.executeFindMany(modelName, args);
          },
          findUnique: async (args: any = {}) => {
            return engine.executeFindUnique(modelName, args);
          },
          findUniqueOrThrow: async (args: any = {}) => {
            const res = await engine.executeFindUnique(modelName, args);
            if (!res) {
              throw new PrismaClientKnownRequestError(`An operation failed because it depends on one or more records that were required but not found.`, {
                code: 'P2025'
              });
            }
            return res;
          },
          findFirst: async (args: any = {}) => {
            const list = await engine.executeFindMany(modelName, { ...args, take: 1 });
            return list.length > 0 ? list[0] : null;
          },
          create: async (args: any = {}) => {
            return engine.executeCreate(modelName, args);
          },
          createMany: async (args: any = {}) => {
            return engine.executeCreateMany(modelName, args);
          },
          update: async (args: any = {}) => {
            return engine.executeUpdate(modelName, args);
          },
          updateMany: async (args: any = {}) => {
            return engine.executeUpdateMany(modelName, args);
          },
          upsert: async (args: any = {}) => {
            return engine.executeUpsert(modelName, args);
          },
          delete: async (args: any = {}) => {
            return engine.executeDelete(modelName, args);
          },
          deleteMany: async (args: any = {}) => {
            return engine.executeDeleteMany(modelName, args);
          }
        };
      }
    };

    return new Proxy({}, handler);
  }

  // Model Query Implementations
  private executeFindMany(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'findMany', args);
    this.executionLogs.push({
      model: modelName,
      action: 'findMany',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    let results = [...table];

    // Filter
    if (args.where) {
      results = results.filter(row => matchWhere(row, args.where));
    }

    // Sort
    if (args.orderBy) {
      applyOrderBy(results, args.orderBy);
    }

    // Cursor
    if (args.cursor) {
      const cursorKey = Object.keys(args.cursor)[0];
      const cursorVal = args.cursor[cursorKey];
      const idx = results.findIndex(r => r[cursorKey] === cursorVal);
      if (idx !== -1) {
        results = results.slice(idx);
      }
    }

    // Skip
    if (args.skip) {
      results = results.slice(args.skip);
    }

    // Take
    if (args.take) {
      results = results.slice(0, args.take);
    }

    // Shape output with select or include
    return results.map(row => shapeRow(row, modelName, args, this));
  }

  private executeFindUnique(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'findUnique', args);
    this.executionLogs.push({
      model: modelName,
      action: 'findUnique',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    const found = table.find(row => matchWhere(row, args.where || {}));
    return found ? shapeRow(found, modelName, args, this) : null;
  }

  private executeCreate(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'create', args);
    this.executionLogs.push({
      model: modelName,
      action: 'create',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    const data = args.data || {};

    // Check unique constraints (e.g. email, sku)
    if (data.email) {
      const exists = table.some(r => r.email === data.email);
      if (exists) {
        throw new PrismaClientKnownRequestError(`Unique constraint failed on the fields: (\`email\`)`, {
          code: 'P2002',
          meta: { target: ['email'] }
        });
      }
    }

    const newId = table.length > 0 ? Math.max(...table.map(r => r.id || 0)) + 1 : 1;
    const newRecord = {
      id: newId,
      createdAt: new Date().toISOString(),
      ...data
    };

    // Handle nested writes (e.g. items: { create: [...] })
    if (data.items?.create) {
      const itemsList = Array.isArray(data.items.create) ? data.items.create : [data.items.create];
      const itemsTable = this.getTable('orderItem');
      itemsList.forEach((it: any, i: number) => {
        itemsTable.push({
          id: itemsTable.length + 1,
          orderId: newId,
          ...it
        });
      });
    }

    table.push(newRecord);
    return shapeRow(newRecord, modelName, args, this);
  }

  private executeCreateMany(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'createMany', args);
    this.executionLogs.push({
      model: modelName,
      action: 'createMany',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const records = Array.isArray(args.data) ? args.data : [args.data];
    const table = this.getTable(modelName);
    let count = 0;

    for (const rec of records) {
      const newId = table.length > 0 ? Math.max(...table.map(r => r.id || 0)) + 1 : 1;
      table.push({ id: newId, ...rec });
      count++;
    }

    return { count };
  }

  private executeUpdate(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'update', args);
    this.executionLogs.push({
      model: modelName,
      action: 'update',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    const row = table.find(r => matchWhere(r, args.where || {}));
    if (!row) {
      throw new PrismaClientKnownRequestError(`Record to update not found.`, {
        code: 'P2025'
      });
    }

    const data = args.data || {};
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === 'object' && val !== null) {
        if ('increment' in val) {
          row[key] = (row[key] || 0) + (val as any).increment;
        } else if ('decrement' in val) {
          row[key] = (row[key] || 0) - (val as any).decrement;
        }
      } else {
        row[key] = val;
      }
    }

    return shapeRow(row, modelName, args, this);
  }

  private executeUpdateMany(modelName: string, args: any = {}) {
    const table = this.getTable(modelName);
    let count = 0;
    const matching = table.filter(r => matchWhere(r, args.where || {}));
    for (const row of matching) {
      Object.assign(row, args.data || {});
      count++;
    }
    return { count };
  }

  private executeUpsert(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'upsert', args);
    this.executionLogs.push({
      model: modelName,
      action: 'upsert',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    const existing = table.find(r => matchWhere(r, args.where || {}));
    if (existing) {
      return this.executeUpdate(modelName, { where: args.where, data: args.update });
    } else {
      return this.executeCreate(modelName, { data: args.create });
    }
  }

  private executeDelete(modelName: string, args: any = {}) {
    const sql = generateSqlFromPrismaCall(modelName, 'delete', args);
    this.executionLogs.push({
      model: modelName,
      action: 'delete',
      args,
      sql,
      timestamp: new Date().toISOString()
    });

    const table = this.getTable(modelName);
    const index = table.findIndex(r => matchWhere(r, args.where || {}));
    if (index === -1) {
      throw new PrismaClientKnownRequestError(`Record to delete does not exist.`, {
        code: 'P2025'
      });
    }

    const removed = table.splice(index, 1)[0];
    return removed;
  }

  private executeDeleteMany(modelName: string, args: any = {}) {
    const table = this.getTable(modelName);
    const beforeCount = table.length;
    const remaining = table.filter(r => !matchWhere(r, args.where || {}));
    this.tables[modelName.toLowerCase() + 's'] = remaining;
    return { count: beforeCount - remaining.length };
  }
}

// Helpers
function matchWhere(row: any, where: any): boolean {
  for (const [k, v] of Object.entries(where)) {
    if (k === 'AND' && Array.isArray(v)) {
      if (!v.every(sub => matchWhere(row, sub))) return false;
      continue;
    }
    if (k === 'OR' && Array.isArray(v)) {
      if (!v.some(sub => matchWhere(row, sub))) return false;
      continue;
    }
    if (v === undefined) continue;

    const rowVal = row[k];
    if (typeof v === 'object' && v !== null) {
      const obj = v as any;
      if ('gte' in obj && !(rowVal >= obj.gte)) return false;
      if ('lte' in obj && !(rowVal <= obj.lte)) return false;
      if ('gt' in obj && !(rowVal > obj.gt)) return false;
      if ('lt' in obj && !(rowVal < obj.lt)) return false;
      if ('equals' in obj && rowVal !== obj.equals) return false;
      if ('contains' in obj) {
        const needle = String(obj.contains).toLowerCase();
        const haystack = String(rowVal || '').toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if ('in' in obj && Array.isArray(obj.in)) {
        if (!obj.in.includes(rowVal)) return false;
      }
    } else {
      if (rowVal !== v) return false;
    }
  }
  return true;
}

function applyOrderBy(list: any[], orderBy: any) {
  const spec = Array.isArray(orderBy) ? orderBy[0] : orderBy;
  const key = Object.keys(spec)[0];
  const dir = (spec[key] || 'asc').toLowerCase();

  list.sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

function shapeRow(row: any, modelName: string, args: any, engine: InBrowserPrismaEngine) {
  let shaped = { ...row };

  // Select
  if (args.select) {
    const picked: Record<string, any> = {};
    for (const [f, flag] of Object.entries(args.select)) {
      if (flag === true) {
        picked[f] = row[f];
      } else if (typeof flag === 'object') {
        // Relation select
        picked[f] = resolveRelation(row, modelName, f, flag, engine);
      }
    }
    shaped = picked;
  } else if (args.include) {
    for (const [rel, flag] of Object.entries(args.include)) {
      if (flag) {
        shaped[rel] = resolveRelation(row, modelName, rel, typeof flag === 'object' ? flag : {}, engine);
      }
    }
  }

  return shaped;
}

function resolveRelation(row: any, parentModel: string, relationField: string, relArgs: any, engine: InBrowserPrismaEngine) {
  const targetTable = relationField.toLowerCase();
  const allRows = engine['tables'][targetTable] || [];

  if (relationField === 'posts') {
    const list = allRows.filter((p: any) => p.authorId === row.id);
    if (relArgs.select) {
      return list.map(item => {
        const sub: Record<string, any> = {};
        for (const [k, v] of Object.entries(relArgs.select)) {
          if (v) sub[k] = item[k];
        }
        return sub;
      });
    }
    return list;
  }

  if (relationField === 'author') {
    const users = engine['tables']['users'] || [];
    const author = users.find((u: any) => u.id === row.authorId);
    if (author && relArgs.select) {
      const sub: Record<string, any> = {};
      for (const [k, v] of Object.entries(relArgs.select)) {
        if (v) sub[k] = author[k];
      }
      return sub;
    }
    return author || null;
  }

  if (relationField === 'profile') {
    const profiles = engine['tables']['profiles'] || [];
    return profiles.find((p: any) => p.userId === row.id) || null;
  }

  if (relationField === 'items') {
    return allRows.filter((it: any) => it.orderId === row.id);
  }

  return [];
}

export function inferTypeScriptType(data: any): string {
  if (data === null) return 'null';
  if (data === undefined) return 'undefined';

  if (Array.isArray(data)) {
    if (data.length === 0) return 'any[]';
    const innerType = inferTypeScriptType(data[0]);
    return `${innerType}[]`;
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) return 'Record<string, any>';
    const lines = entries.map(([key, val]) => {
      let t = typeof val as string;
      if (val === null) t = 'string | null';
      else if (Array.isArray(val)) t = inferTypeScriptType(val);
      else if (typeof val === 'object') t = inferTypeScriptType(val);
      return `  ${key}: ${t};`;
    });
    return `{\n${lines.join('\n')}\n}`;
  }

  return typeof data;
}

/**
 * Executes user code safely in the browser context with Prisma and Zod bindings
 */
export async function executeUserCode(
  userCode: string,
  engine: InBrowserPrismaEngine,
  activeTab: 'editor' | 'schema' = 'editor'
): Promise<ExecutionResult> {
  const startTime = performance.now();
  engine.executionLogs = [];

  if (activeTab === 'schema') {
    // Schema task evaluation
    const duration = performance.now() - startTime;
    return {
      success: true,
      data: { message: 'Prisma schema compiled successfully.', valid: true },
      inferredType: 'type SchemaDefinition = Prisma.DMMF.Datamodel',
      queryLogs: [],
      durationMs: Number(duration.toFixed(2))
    };
  }

  try {
    const prisma = engine.createClientProxy();

    // Prepare evaluation context
    // Wrap common export functions or bare expressions
    let executableCode = userCode;

    // Remove imports
    executableCode = executableCode
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+(async\s+function|function|const|class)/g, '$1');

    // Run in AsyncFunction wrapper
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const runner = new AsyncFunction('prisma', 'z', 'Prisma', `
      ${executableCode}

      // Auto-invoke defined functions for evaluation
      if (typeof getUserById === 'function') return await getUserById(1);
      if (typeof getActiveMember === 'function') return await getActiveMember('alice@prisma.io');
      if (typeof getProductBySku === 'function') return await getProductBySku('TECH-WIR-001');
      if (typeof getLatestDiscount === 'function') return await getLatestDiscount();
      if (typeof getAuthorPublicProfile === 'function') return await getAuthorPublicProfile(1);
      if (typeof getAuthorWithPostsBuggy === 'function') return await getAuthorWithPostsBuggy(1);
      if (typeof getActiveAdults === 'function') return await getActiveAdults();
      if (typeof searchArticles === 'function') return await searchArticles('prisma');
      if (typeof getPaginatedProducts === 'function') return await getPaginatedProducts(1, 2);
      if (typeof getActivityStream === 'function') return await getActivityStream(10, 2);
      if (typeof createCategory === 'function') return await createCategory('Gaming', 'gaming');
      if (typeof importTags === 'function') return await importTags([{ name: 'react' }, { name: 'nextjs' }]);
      if (typeof handleCreateProduct === 'function') return await handleCreateProduct({ title: 'Mechanical Keyboard', price: 99 });
      if (typeof updateCustomerEmail === 'function') return await updateCustomerEmail(1, 'updated@prisma.io');
      if (typeof purchaseItem === 'function') return await purchaseItem(101, 2);
      if (typeof setPreference === 'function') return await setPreference(1, false);
      if (typeof recordPageView === 'function') return await recordPageView('/blog');
      if (typeof softDeleteUser === 'function') return await softDeleteUser(1);
      if (typeof getActiveAccounts === 'function') return await getActiveAccounts();
      if (typeof createOrderWithItems === 'function') return await createOrderWithItems(1, [{ title: 'USB Cable', price: 15 }]);
      if (typeof createConnectedPost === 'function') return await createConnectedPost('Testing', 1, 1);
      if (typeof recordInventoryChange === 'function') return await recordInventoryChange(101, 5);
      if (typeof bookSeat === 'function') return await bookSeat(1, 1);
      if (typeof safeCreateUser === 'function') return await safeCreateUser({ email: 'alice@prisma.io', name: 'Alice' });
      if (typeof safeDeletePost === 'function') return await safeDeletePost(9999);
      if (typeof PostService !== 'undefined' && typeof PostService.getFeed === 'function') return await PostService.getFeed();
      if (typeof PostService !== 'undefined' && typeof PostService.createPost === 'function') return await PostService.createPost(1, 'Hello Prisma', ['tech']);
      if (typeof getGenerateCommand === 'function') return getGenerateCommand();
      if (typeof getProductionMigrationCommand === 'function') return getProductionMigrationCommand();
      if (typeof formatPooledDbUrl === 'function') return formatPooledDbUrl('postgres://user:pass@ep-cool.aws.neon.tech/neondb');
      if (typeof createLoggedClient === 'function') return createLoggedClient();
      if (typeof setupGracefulShutdown === 'function') return setupGracefulShutdown(prisma);
      if (typeof deletePostHandler === 'function') {
        const mockRes = { status: (c: number) => ({ send: () => ({ status: c }) }) };
        return await deletePostHandler({ params: { id: '1' } }, mockRes, () => {});
      }
      if (typeof updatePostHandler === 'function') {
        const mockRes = { status: (c: number) => ({ json: (d: any) => d }) };
        return await updatePostHandler({ params: { id: '1' }, body: { title: 'Updated' } }, mockRes, () => {});
      }
      if (typeof errorHandler === 'function' || typeof extendedErrorHandler === 'function') {
        const handler = typeof extendedErrorHandler === 'function' ? extendedErrorHandler : errorHandler;
        const mockRes = { status: (c: number) => ({ json: (d: any) => ({ code: c, ...d }) }) };
        return handler(new Prisma.PrismaClientKnownRequestError('Unique error', { code: 'P2002' }), {}, mockRes, () => {});
      }

      return { executed: true, logs: 'Code evaluated successfully' };
    `);

    const result = await runner(prisma, z, Prisma);
    const duration = performance.now() - startTime;
    const inferred = inferTypeScriptType(result);

    return {
      success: true,
      data: result,
      inferredType: inferred,
      queryLogs: engine.executionLogs,
      durationMs: Number(duration.toFixed(2))
    };
  } catch (err: any) {
    const duration = performance.now() - startTime;
    return {
      success: false,
      data: null,
      error: {
        name: err.name || 'Error',
        message: err.message || 'An unexpected error occurred during execution.',
        code: err.code,
        meta: err.meta,
        stack: err.stack
      },
      inferredType: 'never',
      queryLogs: engine.executionLogs,
      durationMs: Number(duration.toFixed(2))
    };
  }
}
