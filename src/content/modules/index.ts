// =============================================================================
// CURRICULUM MODULES REGISTRY & EXPORTS
// =============================================================================

import { ModuleData } from '../../types/curriculum';
import { ALL_MILESTONES } from './milestones';
import { MILESTONE_1_MODULES } from './day-01-to-04';
import { MILESTONE_2_MODULES } from './day-05-to-08';
import { MILESTONE_3_MODULES } from './day-09-to-12';
import { MILESTONE_4_MODULES } from './day-13-to-14';

export { ALL_MILESTONES };

export const ALL_MODULES: ModuleData[] = [
  ...MILESTONE_1_MODULES,
  ...MILESTONE_2_MODULES,
  ...MILESTONE_3_MODULES,
  ...MILESTONE_4_MODULES,
];

export function getModuleById(id: string): ModuleData | undefined {
  return ALL_MODULES.find(m => m.id === id);
}

export function getModuleByDay(day: number): ModuleData | undefined {
  return ALL_MODULES.find(m => m.day === day);
}

export function getAllTasksCount(): number {
  return ALL_MODULES.reduce((acc, m) => {
    const conceptTasks = m.concepts.reduce((cAcc, c) => cAcc + c.tasks.length, 0);
    const challengeTasks = m.challenge.tasks.length;
    return acc + conceptTasks + challengeTasks;
  }, 0);
}
