// =============================================================================
// USER PROGRESS & LOCAL STORAGE ENGINE
// =============================================================================

import { UserProgressState, ModuleData, DayLocation } from '../../types/curriculum';

export type { UserProgressState, DayLocation };

const STORAGE_KEY_V2 = 'prismalens_user_progress_v2';
const STORAGE_KEY_V1 = 'prismalens_user_progress_v1';

export interface ExtendedUserProgressState extends UserProgressState {
  version?: number;
}

export const INITIAL_PROGRESS_STATE: ExtendedUserProgressState = {
  version: 2,
  completedTaskIds: [],
  completedConceptIds: [],
  completedDayIds: [],
  unlockedDayIds: ['day-01'], // Day 1 is unlocked initially
  currentDayId: 'day-01',
  currentStep: 'theory',
  currentConceptId: 'day-01-concept-1',
  currentTaskId: undefined,
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  xp: 0,
  taskUserCode: {},
  lastVisitedByDay: {}
};

export function loadUserProgress(): ExtendedUserProgressState {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_STATE;
  try {
    // Try V2 first
    const rawV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      return { ...INITIAL_PROGRESS_STATE, ...parsed, version: 2 };
    }

    // Attempt migration from V1
    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1);
      const migrated: ExtendedUserProgressState = {
        ...INITIAL_PROGRESS_STATE,
        ...parsedV1,
        version: 2
      };
      // Save migrated data to V2
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      return migrated;
    }

    return INITIAL_PROGRESS_STATE;
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return INITIAL_PROGRESS_STATE;
  }
}

export const loadProgress = loadUserProgress;

export function saveUserProgress(state: ExtendedUserProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = { ...state, version: 2 };
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export const saveProgress = saveUserProgress;

export function saveTaskDraft(state: ExtendedUserProgressState, taskId: string, code: string): ExtendedUserProgressState {
  return {
    ...state,
    taskUserCode: {
      ...(state.taskUserCode || {}),
      [taskId]: code
    }
  };
}

export function getTaskDraft(state: ExtendedUserProgressState, taskId: string): string | undefined {
  return state.taskUserCode?.[taskId];
}

export function recordDayLocation(
  state: ExtendedUserProgressState,
  dayId: string,
  location: {
    conceptId?: string;
    subStep: 'overview' | 'theory' | 'practice' | 'challenge';
    taskId?: string;
  }
): ExtendedUserProgressState {
  const current = state.lastVisitedByDay || {};
  return {
    ...state,
    lastVisitedByDay: {
      ...current,
      [dayId]: {
        conceptId: location.conceptId || current[dayId]?.conceptId || state.currentConceptId || '',
        subStep: location.subStep,
        taskId: location.taskId !== undefined ? location.taskId : current[dayId]?.taskId,
        timestamp: Date.now()
      }
    }
  };
}

export function updateLearningPosition(
  state: ExtendedUserProgressState,
  pos: { dayId?: string; step?: any; conceptId?: string; taskId?: string }
): ExtendedUserProgressState {
  const targetDay = pos.dayId || state.currentDayId;
  const currentVisited = state.lastVisitedByDay || {};
  const updatedVisited = targetDay
    ? {
        ...currentVisited,
        [targetDay]: {
          conceptId: pos.conceptId || currentVisited[targetDay]?.conceptId || state.currentConceptId || '',
          subStep: pos.step || currentVisited[targetDay]?.subStep || state.currentStep || 'theory',
          taskId: pos.taskId !== undefined ? pos.taskId : currentVisited[targetDay]?.taskId,
          timestamp: Date.now()
        }
      }
    : currentVisited;

  return {
    ...state,
    ...(pos.dayId ? { currentDayId: pos.dayId } : {}),
    ...(pos.step ? { currentStep: pos.step } : {}),
    ...(pos.conceptId !== undefined ? { currentConceptId: pos.conceptId } : {}),
    ...(pos.taskId !== undefined ? { currentTaskId: pos.taskId } : {}),
    lastVisitedByDay: updatedVisited
  };
}

export function resolveDayResumeTarget(
  module: ModuleData,
  progress: UserProgressState
): {
  subStep: 'overview' | 'theory' | 'practice' | 'challenge';
  conceptId?: string;
  taskId?: string;
  label: string;
} {
  // Case A: User previously visited this day and has a saved location
  const saved = progress.lastVisitedByDay?.[module.id];
  if (saved) {
    if (saved.subStep === 'challenge') {
      return {
        subStep: 'challenge',
        label: `Day ${module.day} Capstone Challenge`
      };
    }
    const matchedConcept = module.concepts.find(c => c.id === saved.conceptId);
    if (matchedConcept) {
      const cIdx = module.concepts.findIndex(c => c.id === matchedConcept.id);
      if (saved.subStep === 'practice') {
        const tIdx = saved.taskId
          ? matchedConcept.tasks.findIndex(t => t.id === saved.taskId)
          : 0;
        return {
          subStep: 'practice',
          conceptId: matchedConcept.id,
          taskId: saved.taskId || matchedConcept.tasks[0]?.id,
          label: `Concept ${cIdx + 1} · Task ${tIdx >= 0 ? tIdx + 1 : 1}`
        };
      }
      return {
        subStep: 'theory',
        conceptId: matchedConcept.id,
        taskId: saved.taskId,
        label: `Concept ${cIdx + 1} Theory: ${matchedConcept.title}`
      };
    }
  }

  // Case B: Find first concept with uncompleted tasks
  const firstIncompleteConcept = module.concepts.find(c =>
    c.tasks.some(t => !progress.completedTaskIds.includes(t.id))
  );

  if (firstIncompleteConcept) {
    const cIdx = module.concepts.findIndex(c => c.id === firstIncompleteConcept.id);
    const firstIncompleteTask = firstIncompleteConcept.tasks.find(
      t => !progress.completedTaskIds.includes(t.id)
    );
    const hasStartedConcept = firstIncompleteConcept.tasks.some(
      t => progress.completedTaskIds.includes(t.id)
    );

    if (hasStartedConcept && firstIncompleteTask) {
      const tIdx = firstIncompleteConcept.tasks.findIndex(t => t.id === firstIncompleteTask.id);
      return {
        subStep: 'practice',
        conceptId: firstIncompleteConcept.id,
        taskId: firstIncompleteTask.id,
        label: `Concept ${cIdx + 1} · Task ${tIdx + 1}`
      };
    }

    return {
      subStep: 'theory',
      conceptId: firstIncompleteConcept.id,
      taskId: firstIncompleteTask?.id,
      label: `Concept ${cIdx + 1} Theory: ${firstIncompleteConcept.title}`
    };
  }

  // Case C: All concepts completed, check challenge
  const challengeTasks = module.challenge?.tasks || [];
  const challengeComplete =
    challengeTasks.length > 0 &&
    challengeTasks.every(t => progress.completedTaskIds.includes(t.id));

  if (!challengeComplete && challengeTasks.length > 0) {
    return {
      subStep: 'challenge',
      label: `Day ${module.day} Capstone Challenge`
    };
  }

  // Case D: Completed Day review
  return {
    subStep: 'theory',
    conceptId: module.concepts[0]?.id,
    label: `Review Day ${module.day} Concepts`
  };
}

export function markTaskComplete(state: ExtendedUserProgressState, taskId: string): ExtendedUserProgressState {
  if (state.completedTaskIds.includes(taskId)) return state;
  return {
    ...state,
    completedTaskIds: [...state.completedTaskIds, taskId],
    xp: state.xp + 25
  };
}

export function markDayComplete(state: ExtendedUserProgressState, dayId: string, xpEarned: number = 100): ExtendedUserProgressState {
  // If day is already completed, do not re-award XP or duplicate streak increments
  if (state.completedDayIds.includes(dayId)) {
    return state;
  }

  const completedDayIds = [...state.completedDayIds, dayId];
  const newStreak = calculateStreak(state.lastActiveDate, state.streakDays);

  return {
    ...state,
    completedDayIds,
    xp: state.xp + xpEarned,
    streakDays: newStreak,
    lastActiveDate: new Date().toISOString()
  };
}

export function resetProgress(): UserProgressState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_V2);
    localStorage.removeItem(STORAGE_KEY_V1);
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

export function calculateStreak(lastActiveIso: string, currentStreak: number, referenceDate: Date = new Date()): number {
  if (!lastActiveIso) return 1;
  const last = new Date(lastActiveIso);
  if (isNaN(last.getTime())) return 1;

  const lastDateOnly = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const refDateOnly = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

  const diffMs = refDateOnly.getTime() - lastDateOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    // Same calendar day: retain current streak (minimum 1)
    return Math.max(1, currentStreak);
  } else if (diffDays === 1) {
    // Exactly consecutive calendar day: increment streak
    return Math.max(1, currentStreak + 1);
  } else {
    // Gap day (> 1 day missed): streak resets to 1
    return 1;
  }
}
