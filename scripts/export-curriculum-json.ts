import fs from 'fs';
import path from 'path';
import { ALL_MODULES, ALL_MILESTONES, getAllTasksCount } from '../src/content/modules';

const outputDir = path.resolve(process.cwd(), 'curriculum-json');
const publicDir = path.resolve(process.cwd(), 'public/curriculum');

for (const dir of [outputDir, publicDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Export all milestones
fs.writeFileSync(
  path.join(outputDir, 'milestones.json'),
  JSON.stringify(ALL_MILESTONES, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(publicDir, 'milestones.json'),
  JSON.stringify(ALL_MILESTONES, null, 2),
  'utf-8'
);

// 2. Export full curriculum
const fullCurriculum = {
  version: '1.0.0',
  title: 'PrismaLens 14-Day Production Curriculum',
  totalDays: ALL_MODULES.length,
  totalTasks: getAllTasksCount(),
  milestones: ALL_MILESTONES,
  modules: ALL_MODULES
};

fs.writeFileSync(
  path.join(outputDir, 'curriculum-full.json'),
  JSON.stringify(fullCurriculum, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(publicDir, 'curriculum-full.json'),
  JSON.stringify(fullCurriculum, null, 2),
  'utf-8'
);

// 3. Export individual days
ALL_MODULES.forEach((mod) => {
  const dayStr = mod.day.toString().padStart(2, '0');
  const filename = `day-${dayStr}.json`;
  fs.writeFileSync(
    path.join(outputDir, filename),
    JSON.stringify(mod, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(publicDir, filename),
    JSON.stringify(mod, null, 2),
    'utf-8'
  );
});

// 4. Export a summary report JSON with task lists and metadata
const curriculumReport = {
  generatedAt: new Date().toISOString(),
  overview: {
    totalDays: ALL_MODULES.length,
    totalConcepts: ALL_MODULES.reduce((acc, m) => acc + m.concepts.length, 0),
    totalTasks: getAllTasksCount(),
    milestonesCount: ALL_MILESTONES.length,
    totalEstimatedMinutes: ALL_MODULES.reduce((acc, m) => acc + m.estimatedMinutes, 0)
  },
  milestones: ALL_MILESTONES.map((ms) => ({
    id: ms.id,
    number: ms.number,
    title: ms.title,
    subtitle: ms.subtitle,
    description: ms.description,
    daysRange: ms.daysRange,
    moduleIds: ms.moduleIds
  })),
  days: ALL_MODULES.map((m) => ({
    day: m.day,
    id: m.id,
    slug: m.slug,
    title: m.title,
    shortTitle: m.shortTitle,
    milestoneId: m.milestoneId,
    description: m.description,
    estimatedMinutes: m.estimatedMinutes,
    completionLearnings: m.completionLearnings,
    conceptsCount: m.concepts.length,
    practiceTasksCount: m.concepts.reduce((acc, c) => acc + c.tasks.length, 0),
    challengeTasksCount: m.challenge?.tasks?.length || 0,
    concepts: m.concepts.map((c) => ({
      id: c.id,
      order: c.order,
      title: c.title,
      shortDescription: c.shortDescription,
      hasMcq: !!(c.theory.mcqs && c.theory.mcqs.length > 0),
      tasksCount: c.tasks.length,
      tasks: c.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        type: t.type,
        targetModel: t.targetModel,
        activeTab: t.activeTab || 'editor',
        instructions: t.instructions || [],
        validation: t.validation
      }))
    })),
    finalChallenge: {
      id: m.challenge.id,
      title: m.challenge.title,
      scenario: m.challenge.scenario,
      tasksCount: m.challenge.tasks.length,
      tasks: m.challenge.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        type: t.type,
        targetModel: t.targetModel,
        activeTab: t.activeTab || 'editor',
        instructions: t.instructions || [],
        validation: t.validation
      }))
    }
  }))
};

fs.writeFileSync(
  path.join(outputDir, 'curriculum-summary.json'),
  JSON.stringify(curriculumReport, null, 2),
  'utf-8'
);
fs.writeFileSync(
  path.join(publicDir, 'curriculum-summary.json'),
  JSON.stringify(curriculumReport, null, 2),
  'utf-8'
);

console.log('Successfully exported curriculum JSON files!');
