import { describe, it, expect, beforeEach } from 'vitest';
import { InBrowserPrismaEngine } from './proxy-executor';
import { validateTaskSubmission } from './validator';
import { ALL_MODULES } from '../../content/modules';

const DAY_01_MODULE = ALL_MODULES[0];

describe('InBrowserPrismaEngine', () => {
  let engine: InBrowserPrismaEngine;

  beforeEach(() => {
    engine = new InBrowserPrismaEngine();
  });

  it('initializes with default schema and fixtures', () => {
    expect(engine.getSchemaContent()).toContain('datasource db');
    expect(engine.getSchemaContent()).toContain('model User');
  });

  it('executes findMany query and returns data', async () => {
    const res = await engine.executeCode('return await prisma.user.findMany();');
    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.queryLogs.length).toBeGreaterThan(0);
    expect(res.queryLogs[0].sql.rawSql).toContain('SELECT');
  });

  it('executes findUnique with where clause', async () => {
    const res = await engine.executeCode('return await prisma.user.findUnique({ where: { id: 1 } });');
    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data.id).toBe(1);
  });

  it('executes select clause to project specific fields', async () => {
    const res = await engine.executeCode('return await prisma.user.findUnique({ where: { id: 1 }, select: { id: true, name: true } });');
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: 1, name: res.data.name });
    expect(res.data.email).toBeUndefined();
  });

  it('updates records properly', async () => {
    const res = await engine.executeCode('return await prisma.user.update({ where: { id: 1 }, data: { name: "Updated Alice" } });');
    expect(res.success).toBe(true);
    expect(res.data.name).toBe('Updated Alice');
  });

  it('handles deleteMany without corrupting table state', async () => {
    const res = await engine.executeCode('return await prisma.user.deleteMany({ where: { role: "ADMIN" } });');
    expect(res.success).toBe(true);
    expect(res.data.count).toBeGreaterThanOrEqual(1);

    // Verify remaining users
    const check = await engine.executeCode('return await prisma.user.findMany();');
    expect(check.data.some((u: any) => u.role === 'ADMIN')).toBe(false);
  });
});

describe('Day 1 Curriculum Task Execution & Validation', () => {
  let engine: InBrowserPrismaEngine;

  beforeEach(() => {
    engine = new InBrowserPrismaEngine();
  });

  it('validates Day 1 Concept 1 Task 1 (getUserNameOnly)', async () => {
    const task = DAY_01_MODULE.concepts[0].tasks[0];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates Day 1 Concept 1 Task 2 (getUserByEmail)', async () => {
    const task = DAY_01_MODULE.concepts[0].tasks[1];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates Day 1 Concept 1 Task 3 (getUserAuthCredentials)', async () => {
    const task = DAY_01_MODULE.concepts[0].tasks[2];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates Day 1 Concept 2 Task 1 (getActiveMember)', async () => {
    const task = DAY_01_MODULE.concepts[1].tasks[0];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates Day 1 Concept 2 Task 2 (auditUserQuery)', async () => {
    const task = DAY_01_MODULE.concepts[1].tasks[1];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates Day 1 Challenge Task (getUser)', async () => {
    const task = DAY_01_MODULE.challenge.tasks[0];
    const execRes = await engine.executeCode(task.solutionCode);
    expect(execRes.success).toBe(true);
    const validation = validateTaskSubmission(task, task.solutionCode, execRes);
    expect(validation.passed).toBe(true);
  });

  it('validates all tasks and challenges across all 14 curriculum days', async () => {
    const modules = ALL_MODULES.slice(1);
    for (const mod of modules) {
      for (const concept of mod.concepts) {
        for (const task of concept.tasks) {
          const execRes = await engine.executeCode(task.solutionCode);
          const validation = validateTaskSubmission(task, task.solutionCode, execRes);
          if (!validation.passed) {
            console.error(`FAILED TASK ${task.id} (${mod.id}):`, JSON.stringify(validation.checklist, null, 2));
          }
          expect(validation.passed, `Failed task ${task.id} in ${mod.id}: ${validation.feedbackMessage}`).toBe(true);
        }
      }
      for (const task of mod.challenge.tasks) {
        const execRes = await engine.executeCode(task.solutionCode);
        const validation = validateTaskSubmission(task, task.solutionCode, execRes);
        if (!validation.passed) {
          console.error(`FAILED CHALLENGE ${task.id} (${mod.id}):`, JSON.stringify(validation.checklist, null, 2));
        }
        expect(validation.passed, `Failed challenge task ${task.id} in ${mod.id}: ${validation.feedbackMessage}`).toBe(true);
      }
    }
  });

  describe('Validator Negative Tests & Execution Integrity', () => {
    it('fails when user code includes misleading comments without executing the required method', async () => {
      const task = DAY_01_MODULE.concepts[0].tasks[2]; // requires findUnique on user with id
      // Misleading code: puts the required method in a comment, but actually calls findMany
      const deceptiveCode = `
        // prisma.user.findUnique({ where: { id: 1 }, select: { id: true, email: true } })
        export async function getUserAuthCredentials(userId: number) {
          return await prisma.user.findMany();
        }
      `;
      const execRes = await engine.executeCode(deceptiveCode);
      const validation = validateTaskSubmission(task, deceptiveCode, execRes);
      expect(validation.passed).toBe(false);
      expect(validation.checklist.some((c) => !c.passed && c.id === 'method_call')).toBe(true);
    });

    it('fails when user executes a wrong method on the target model', async () => {
      const task = DAY_01_MODULE.concepts[0].tasks[0]; // requires findUnique on user
      const wrongMethodCode = `
        export async function getUserNameOnly(userId: number) {
          return await prisma.user.findMany({ select: { name: true } });
        }
      `;
      const execRes = await engine.executeCode(wrongMethodCode);
      const validation = validateTaskSubmission(task, wrongMethodCode, execRes);
      expect(validation.passed).toBe(false);
    });

    it('fails when user executes query without the required where clause', async () => {
      const task = DAY_01_MODULE.concepts[0].tasks[1]; // requires where: { email }
      const missingWhereCode = `
        export async function getUserByEmail(email: string) {
          return await prisma.user.findFirst({ select: { id: true, name: true, email: true } });
        }
      `;
      const execRes = await engine.executeCode(missingWhereCode);
      const validation = validateTaskSubmission(task, missingWhereCode, execRes);
      expect(validation.passed).toBe(false);
      expect(validation.checklist.some((c) => !c.passed && c.id === 'where_clauses')).toBe(true);
    });
  });

  describe('Transaction Atomicity & Rollback', () => {
    it('rolls back table mutations if a transaction encounters an error midway', async () => {
      const initialUsersCount = (await engine.executeCode('return await prisma.user.findMany();')).data.length;

      // Execute a failing transaction
      const failingTxCode = `
        return await prisma.$transaction(async (tx) => {
          // Step 1: create a user
          await tx.user.create({ data: { name: 'Temp User', email: 'temp_tx@prisma.io', role: 'USER' } });
          // Step 2: intentionally throw an error
          throw new Error('Simulated payment failure inside transaction');
        });
      `;

      const res = await engine.executeCode(failingTxCode);
      expect(res.success).toBe(false);

      // Verify that Temp User was rolled back and not persisted in database
      const checkRes = await engine.executeCode('return await prisma.user.findMany();');
      expect(checkRes.data.length).toBe(initialUsersCount);
      expect(checkRes.data.some((u: any) => u.email === 'temp_tx@prisma.io')).toBe(false);
    });

    it('calculates tableDiff with inserted, updated, and deleted rows upon mutations', async () => {
      const mutationCode = `
        return await prisma.user.create({
          data: { name: 'New Tester', email: 'tester_diff@prisma.io', role: 'USER' }
        });
      `;
      const res = await engine.executeCode(mutationCode);
      expect(res.success).toBe(true);
      expect(res.tableDiff).toBeDefined();
      expect(res.tableDiff!.length).toBeGreaterThan(0);
      const userDiff = res.tableDiff!.find((d) => d.table === 'user' || d.table === 'users');
      expect(userDiff).toBeDefined();
      expect(userDiff!.inserted.length).toBe(1);
      expect(userDiff!.inserted[0].email).toBe('tester_diff@prisma.io');
    });

    it('does not automatically pass task validation on unfinished initial code', async () => {
      const task1 = DAY_01_MODULE.concepts[0].tasks[0];
      const execRes = await engine.executeCode(task1.initialCode);

      const valRes = validateTaskSubmission(task1, task1.initialCode, execRes);
      expect(valRes.passed).toBe(false);
      const selectCheck = valRes.checklist.find((c) => c.id === 'select_fields');
      expect(selectCheck?.passed).toBe(false);
    });

    it('passes task validation when user writes the correct query with select projection', async () => {
      const task1 = DAY_01_MODULE.concepts[0].tasks[0];
      const solutionCode = `
        export async function getUserNameOnly(userId: number) {
          return await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true }
          });
        }
      `;
      const execRes = await engine.executeCode(solutionCode);
      const valRes = validateTaskSubmission(task1, solutionCode, execRes);
      expect(valRes.passed).toBe(true);
    });
  });
});

