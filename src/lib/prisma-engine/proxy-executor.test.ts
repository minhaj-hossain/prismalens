import { describe, it, expect, beforeEach } from 'vitest';
import { InBrowserPrismaEngine } from './proxy-executor';
import { validateTaskSubmission } from './validator';
import { MILESTONE_1_MODULES } from '../../content/modules/day-01-to-04';

const DAY_01_MODULE = MILESTONE_1_MODULES[0];

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

  it('validates Day 2, Day 3, and Day 4 tasks solution code', async () => {
    const modules = [MILESTONE_1_MODULES[1], MILESTONE_1_MODULES[2], MILESTONE_1_MODULES[3]];
    for (const mod of modules) {
      for (const concept of mod.concepts) {
        for (const task of concept.tasks) {
          const execRes = await engine.executeCode(task.solutionCode);
          const validation = validateTaskSubmission(task, task.solutionCode, execRes);
          if (!validation.passed) {
            console.error(`FAILED TASK ${task.id}:`, JSON.stringify(validation.checklist, null, 2));
          }
          expect(validation.passed, `Failed task ${task.id}: ${validation.feedbackMessage}`).toBe(true);
        }
      }
      for (const task of mod.challenge.tasks) {
        const execRes = await engine.executeCode(task.solutionCode);
        const validation = validateTaskSubmission(task, task.solutionCode, execRes);
        if (!validation.passed) {
          console.error(`FAILED CHALLENGE ${task.id}:`, JSON.stringify(validation.checklist, null, 2));
        }
        expect(validation.passed, `Failed challenge task ${task.id}: ${validation.feedbackMessage}`).toBe(true);
      }
    }
  });
});
