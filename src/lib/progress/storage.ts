// =============================================================================
// USER PROGRESS & LOCAL STORAGE ENGINE
// =============================================================================

import { UserProgressState } from '../../types/curriculum';

export type { UserProgressState };

const STORAGE_KEY = 'prismalens_user_progress_v1';

export const INITIAL_PROGRESS_STATE: UserProgressState = {
  completedTaskIds: [],
  completedConceptIds: [],
  completedDayIds: [],
  unlockedDayIds: ['day-01'], // Day 1 is unlocked initially
  currentDayId: 'day-01',
  currentStep: 'theory',
  currentConceptId: 'day-01-concept-1',
  currentTaskId: undefined,
  streakDays: 3,
  lastActiveDate: new Date().toISOString(),
  xp: 0,
  taskUserCode: {}
};

export function loadUserProgress(): UserProgressState {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS_STATE, ...parsed };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return INITIAL_PROGRESS_STATE;
  }
}

export const loadProgress = loadUserProgress;

export function saveUserProgress(state: UserProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export const saveProgress = saveUserProgress;

export function markTaskComplete(state: UserProgressState, taskId: string): UserProgressState {
  if (state.completedTaskIds.includes(taskId)) return state;
  return {
    ...state,
    completedTaskIds: [...state.completedTaskIds, taskId],
    xp: state.xp + 25
  };
}

export function markDayComplete(state: UserProgressState, dayId: string, xpEarned: number = 100): UserProgressState {
  const completedDayIds = state.completedDayIds.includes(dayId)
    ? state.completedDayIds
    : [...state.completedDayIds, dayId];

  return {
    ...state,
    completedDayIds,
    xp: state.xp + xpEarned,
    streakDays: state.streakDays + 1,
    lastActiveDate: new Date().toISOString()
  };
}

export function resetProgress(): UserProgressState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { ...INITIAL_PROGRESS_STATE };
}

export function isTaskCompleted(state: UserProgressState, taskId: string): boolean {
  return state.completedTaskIds.includes(taskId);
}

export function isConceptCompleted(state: UserProgressState, concept: { tasks: { id: string }[] }): boolean {
  if (concept.tasks.length === 0) return true;
  return concept.tasks.every(t => state.completedTaskIds.includes(t.id));
}

export function isDayCompleted(state: UserProgressState, dayId: string): boolean {
  return state.completedDayIds.includes(dayId);
}

export function isDayUnlocked(state: UserProgressState, dayId: string, allModules: { id: string }[]): boolean {
  if (dayId === 'day-01' || state.unlockedDayIds.includes(dayId)) return true;
  const idx = allModules.findIndex(m => m.id === dayId);
  if (idx <= 0) return true;
  const prevId = allModules[idx - 1].id;
  return state.completedDayIds.includes(prevId);
}

export function calculateDayProgress(
  state: UserProgressState,
  module: { concepts: { tasks: { id: string }[] }[]; challenge: { tasks: { id: string }[] }; id: string }
): { totalTasks: number; completedTasks: number; percentage: number; isCompleted: boolean } {
  const allTaskIds: string[] = [];
  module.concepts.forEach(c => c.tasks.forEach(t => allTaskIds.push(t.id)));
  module.challenge.tasks.forEach(t => allTaskIds.push(t.id));

  const totalTasks = allTaskIds.length;
  if (totalTasks === 0) return { totalTasks: 0, completedTasks: 0, percentage: 100, isCompleted: true };

  const completedTasks = allTaskIds.filter(id => state.completedTaskIds.includes(id)).length;
  const percentage = Math.round((completedTasks / totalTasks) * 100);
  const isCompleted = state.completedDayIds.includes(module.id) || (completedTasks === totalTasks);

  return { totalTasks, completedTasks, percentage, isCompleted };
}

export function calculateOverallProgress(
  state: UserProgressState,
  allModules: { id: string; concepts: { tasks: { id: string }[] }[]; challenge: { tasks: { id: string }[] } }[]
): {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  completedDays: number;
  totalDays: number;
  currentStageNumber: number;
} {
  let totalTasks = 0;
  let completedTasks = 0;

  allModules.forEach(mod => {
    mod.concepts.forEach(c => c.tasks.forEach(t => {
      totalTasks++;
      if (state.completedTaskIds.includes(t.id)) completedTasks++;
    }));
    mod.challenge.tasks.forEach(t => {
      totalTasks++;
      if (state.completedTaskIds.includes(t.id)) completedTasks++;
    });
  });

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedDays = allModules.filter(m => state.completedDayIds.includes(m.id)).length;

  // Determine current active stage (1 to 4)
  let currentStageNumber = 1;
  if (completedDays >= 12) {
    currentStageNumber = 4;
  } else if (completedDays >= 8) {
    currentStageNumber = 3;
  } else if (completedDays >= 4) {
    currentStageNumber = 2;
  }

  return {
    totalTasks,
    completedTasks,
    percentage,
    completedDays,
    totalDays: allModules.length,
    currentStageNumber
  };
}

export interface DerivedPosition {
  dayId: string;
  conceptId?: string;
  taskId?: string;
  step: 'theory' | 'practice' | 'challenge' | 'complete' | 'overview';
  label: string;
}

export function deriveLastPosition(
  state: UserProgressState,
  allModules: { id: string; title: string; concepts: { id: string; title: string; tasks: { id: string }[] }[]; challenge: { tasks: { id: string }[] } }[]
): DerivedPosition {
  // Find first day that is not fully completed
  for (const mod of allModules) {
    const dayDone = isDayCompleted(state, mod.id);
    if (!dayDone) {
      // Find first uncompleted concept
      for (const concept of mod.concepts) {
        const anyTaskInConceptDone = concept.tasks.some(t => state.completedTaskIds.includes(t.id));
        const allTasksDone = concept.tasks.every(t => state.completedTaskIds.includes(t.id));

        if (!allTasksDone) {
          // If not even first task is done, start at theory!
          if (!anyTaskInConceptDone) {
            return {
              dayId: mod.id,
              conceptId: concept.id,
              step: 'theory',
              label: `Continue: ${concept.title}`
            };
          }
          // Otherwise find first uncompleted task
          const uncompletedTask = concept.tasks.find(t => !state.completedTaskIds.includes(t.id));
          return {
            dayId: mod.id,
            conceptId: concept.id,
            taskId: uncompletedTask?.id,
            step: 'practice',
            label: `Continue: ${concept.title}`
          };
        }
      }

      // If all concepts are done, check challenge
      const challengeTasksDone = mod.challenge.tasks.every(t => state.completedTaskIds.includes(t.id));
      if (!challengeTasksDone) {
        return {
          dayId: mod.id,
          step: 'challenge',
          label: `Continue: Day Final Challenge`
        };
      }

      return {
        dayId: mod.id,
        step: 'complete',
        label: `Day Completed`
      };
    }
  }

  // If everything is completed, default to Day 1
  return {
    dayId: allModules[0]?.id || 'day-01',
    conceptId: allModules[0]?.concepts[0]?.id,
    step: 'overview',
    label: 'Review Course'
  };
}

export function calculateStreak(lastActiveIso: string, currentStreak: number): number {
  if (!lastActiveIso) return 1;
  const last = new Date(lastActiveIso);
  const now = new Date();

  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
