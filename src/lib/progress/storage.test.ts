import { describe, it, expect, beforeEach } from 'vitest';
import {
  INITIAL_PROGRESS_STATE,
  markDayComplete,
  markTaskComplete,
  calculateStreak,
  saveTaskDraft,
  getTaskDraft,
  updateLearningPosition,
  recordDayLocation,
  resolveDayResumeTarget,
  loadUserProgress,
  saveUserProgress,
  ExtendedUserProgressState
} from './storage';

// Polyfill in-memory localStorage for test environment
const mockStorage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => mockStorage.get(key) || null,
  setItem: (key: string, val: string) => { mockStorage.set(key, val); },
  removeItem: (key: string) => { mockStorage.delete(key); },
  clear: () => { mockStorage.clear(); }
};

if (typeof window === 'undefined') {
  (globalThis as any).window = globalThis;
  (globalThis as any).localStorage = localStorageMock;
}

describe('User Progress Storage & State Transitions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('markDayComplete rewards and streak', () => {
    it('awards XP and updates streak upon first completion', () => {
      const state: ExtendedUserProgressState = {
        ...INITIAL_PROGRESS_STATE,
        xp: 100,
        streakDays: 2,
        completedDayIds: ['day-01'],
        lastActiveDate: new Date('2026-09-20T10:00:00Z').toISOString()
      };

      const updated = markDayComplete(state, 'day-02', 100);
      expect(updated.completedDayIds).toContain('day-02');
      expect(updated.xp).toBe(200);
      expect(updated.completedDayIds.length).toBe(2);
    });

    it('does NOT duplicate XP or streak if day is marked complete again', () => {
      const state: ExtendedUserProgressState = {
        ...INITIAL_PROGRESS_STATE,
        xp: 150,
        streakDays: 3,
        completedDayIds: ['day-01', 'day-02'],
        lastActiveDate: new Date().toISOString()
      };

      const result = markDayComplete(state, 'day-02', 100);
      // State should remain unchanged
      expect(result.xp).toBe(150);
      expect(result.streakDays).toBe(3);
      expect(result.completedDayIds.length).toBe(2);
    });

    it('does NOT duplicate task XP if task is marked complete multiple times', () => {
      const state: ExtendedUserProgressState = {
        ...INITIAL_PROGRESS_STATE,
        xp: 50,
        completedTaskIds: ['task-1-1']
      };

      const result = markTaskComplete(state, 'task-1-1');
      expect(result.xp).toBe(50);
      expect(result.completedTaskIds).toEqual(['task-1-1']);
    });
  });

  describe('calculateStreak calendar-day policy', () => {
    it('preserves streak if user returns on the same calendar day', () => {
      const today = new Date('2026-09-22T14:00:00Z');
      const earlierToday = new Date('2026-09-22T08:00:00Z').toISOString();
      const streak = calculateStreak(earlierToday, 5, today);
      expect(streak).toBe(5);
    });

    it('increments streak by 1 if user returns on the next consecutive calendar day', () => {
      const today = new Date('2026-09-23T09:00:00Z');
      const yesterday = new Date('2026-09-22T18:00:00Z').toISOString();
      const streak = calculateStreak(yesterday, 5, today);
      expect(streak).toBe(6);
    });

    it('resets streak to 1 if user misses more than one calendar day', () => {
      const today = new Date('2026-09-25T09:00:00Z');
      const threeDaysAgo = new Date('2026-09-22T10:00:00Z').toISOString();
      const streak = calculateStreak(threeDaysAgo, 10, today);
      expect(streak).toBe(1);
    });

    it('defaults streak to 1 if lastActiveIso is invalid', () => {
      expect(calculateStreak('', 4)).toBe(1);
      expect(calculateStreak('invalid-date', 4)).toBe(1);
    });
  });

  describe('draft saving and learning position persistence', () => {
    it('saves and retrieves task code drafts without corrupting other tasks', () => {
      let state = { ...INITIAL_PROGRESS_STATE };
      state = saveTaskDraft(state, 'task-1-1', 'const draft1 = 42;');
      state = saveTaskDraft(state, 'task-1-2', 'const draft2 = 99;');

      expect(getTaskDraft(state, 'task-1-1')).toBe('const draft1 = 42;');
      expect(getTaskDraft(state, 'task-1-2')).toBe('const draft2 = 99;');
      expect(getTaskDraft(state, 'task-1-3')).toBeUndefined();
    });

    it('updates learning position seamlessly', () => {
      let state = { ...INITIAL_PROGRESS_STATE };
      state = updateLearningPosition(state, {
        dayId: 'day-04',
        step: 'challenge',
        conceptId: 'day-04-concept-2',
        taskId: 'challenge-4-1'
      });

      expect(state.currentDayId).toBe('day-04');
      expect(state.currentStep).toBe('challenge');
      expect(state.currentConceptId).toBe('day-04-concept-2');
      expect(state.currentTaskId).toBe('challenge-4-1');
    });
  });

  describe('Day Resume Navigation Logic', () => {
    it('records day location and resolves saved location accurately', () => {
      let state = { ...INITIAL_PROGRESS_STATE };
      state = recordDayLocation(state, 'day-02', {
        conceptId: 'day-02-concept-2',
        subStep: 'practice',
        taskId: 'day-02-task-3'
      });

      expect(state.lastVisitedByDay?.['day-02']).toBeDefined();
      expect(state.lastVisitedByDay?.['day-02'].conceptId).toBe('day-02-concept-2');
      expect(state.lastVisitedByDay?.['day-02'].subStep).toBe('practice');
      expect(state.lastVisitedByDay?.['day-02'].taskId).toBe('day-02-task-3');
    });

    it('resolves the first incomplete concept when no prior visit is recorded', () => {
      const mockModule = {
        id: 'day-01',
        day: 1,
        title: 'Day 1: Intro',
        concepts: [
          {
            id: 'c1',
            title: 'Concept 1',
            tasks: [{ id: 't1' }, { id: 't2' }]
          },
          {
            id: 'c2',
            title: 'Concept 2',
            tasks: [{ id: 't3' }]
          }
        ],
        challenge: { title: 'Day 1 Challenge', tasks: [{ id: 'ch1' }] }
      } as any;

      // User has completed t1 and t2 (Concept 1 complete)
      const progress = {
        ...INITIAL_PROGRESS_STATE,
        completedTaskIds: ['t1', 't2']
      };

      const target = resolveDayResumeTarget(mockModule, progress);
      expect(target.conceptId).toBe('c2');
      expect(target.subStep).toBe('theory');
    });
  });

  describe('Storage migration (v1 -> v2)', () => {
    it('migrates legacy v1 storage to v2 with version flag and preserves existing user data', () => {
      const v1Data = {
        completedTaskIds: ['task-1-1', 'task-1-2'],
        completedDayIds: ['day-01'],
        xp: 150,
        streakDays: 4
      };
      localStorage.setItem('prismalens_user_progress_v1', JSON.stringify(v1Data));

      const loaded = loadUserProgress();
      expect(loaded.version).toBe(2);
      expect(loaded.completedTaskIds).toEqual(['task-1-1', 'task-1-2']);
      expect(loaded.completedDayIds).toEqual(['day-01']);
      expect(loaded.xp).toBe(150);
      expect(loaded.streakDays).toBe(4);

      // Verify it was persisted to V2 key in localStorage
      expect(localStorage.getItem('prismalens_user_progress_v2')).toBeDefined();
    });
  });
});
