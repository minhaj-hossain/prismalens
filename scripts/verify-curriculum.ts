// =============================================================================
// AUTOMATED CURRICULUM AUDIT & VERIFICATION SCRIPT
// =============================================================================

import { ALL_MODULES } from '../src/content/modules';

export function verifyCurriculum() {
  console.log('🔍 Auditing PrismaLens Curriculum...');
  let totalErrors = 0;
  let totalTasks = 0;

  if (ALL_MODULES.length !== 14) {
    console.error(`❌ Expected exactly 14 modules, found ${ALL_MODULES.length}`);
    totalErrors++;
  }

  for (const module of ALL_MODULES) {
    console.log(`Checking Day ${module.day}: ${module.title}`);

    // Check challenge
    if (!module.challenge || module.challenge.tasks.length === 0) {
      console.error(`  ❌ Day ${module.day} is missing its Final Challenge!`);
      totalErrors++;
    } else {
      totalTasks += module.challenge.tasks.length;
    }

    for (const concept of module.concepts) {
      // Check Target Hero
      if (!concept.theory.targetHero || !concept.theory.targetHero.code) {
        console.error(`  ❌ Concept '${concept.id}' is missing its Target Hero code banner!`);
        totalErrors++;
      }

      // Check Task Count (Minimum 2 tasks per concept)
      if (!concept.tasks || concept.tasks.length < 2) {
        console.error(`  ❌ Concept '${concept.id}' has only ${concept.tasks?.length ?? 0} tasks. Minimum required is 2!`);
        totalErrors++;
      }

      for (const task of concept.tasks) {
        totalTasks++;
        if (!task.initialCode && task.initialCode !== '') {
          console.error(`    ❌ Task '${task.id}' is missing initialCode.`);
          totalErrors++;
        }
        if (!task.solutionCode) {
          console.error(`    ❌ Task '${task.id}' is missing solutionCode.`);
          totalErrors++;
        }
        if (!task.hints || task.hints.length === 0) {
          console.error(`    ❌ Task '${task.id}' is missing hints.`);
          totalErrors++;
        }
        if (!task.validation) {
          console.error(`    ❌ Task '${task.id}' is missing validation rules.`);
          totalErrors++;
        }
      }
    }
  }

  console.log(`\nAudit Complete: ${totalTasks} total tasks verified across 14 days.`);
  if (totalErrors > 0) {
    console.error(`💥 Found ${totalErrors} verification errors!`);
    return false;
  } else {
    console.log('✅ All 14 days passed strict verification with 100% compliance!');
    return true;
  }
}

// Run verification if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('verify-curriculum')) {
  const ok = verifyCurriculum();
  if (!ok) process.exit(1);
}
