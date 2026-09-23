/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ALL_MODULES, ALL_MILESTONES, getModuleById } from './content/modules';
import { ECOM_SCHEMA_PRISMA } from './content/database/seed-schemas';
import { InBrowserPrismaEngine } from './lib/prisma-engine/proxy-executor';
import { parsePrismaSchema } from './lib/prisma-engine/schema-ast-parser';
import {
  loadProgress,
  saveProgress,
  markTaskComplete,
  markDayComplete,
  resetProgress,
  recordDayLocation,
  resolveDayResumeTarget,
  isTaskCompleted as checkTaskCompleted,
  isDayCompleted as checkDayCompleted
} from './lib/progress/storage';
import { Header } from './components/layout/Header';
import { PrismaRoadmapView } from './components/roadmap/PrismaRoadmapView';
import { DayOverviewView } from './components/learning/DayOverviewView';
import { ConceptTheoryView } from './components/learning/ConceptTheoryView';
import { LearningWorkspace } from './components/learning/LearningWorkspace';
import { ErdVisualizer } from './components/learning/ErdVisualizer';
import { SandboxPlayground } from './components/learning/SandboxPlayground';
import { DayCompleteModal } from './components/learning/DayCompleteModal';
import { ErrorBoundary } from './components/ErrorBoundary';

export type MainView = 'roadmap' | 'learn' | 'erd' | 'playground';
export type DaySubStep = 'overview' | 'theory' | 'practice' | 'challenge';

export default function App() {
  // Persisted user learning progress
  const [progress, setProgress] = useState(loadProgress);

  // In-memory Prisma Query Simulation Engine
  const engine = useMemo(() => {
    return new InBrowserPrismaEngine();
  }, []);

  // Parsed AST for ERD visualizer
  const schemaAst = useMemo(() => {
    return parsePrismaSchema(ECOM_SCHEMA_PRISMA);
  }, []);

  // Main View Router
  const [activeView, setActiveView] = useState<MainView>('roadmap');

  // In-Day Sub-Step Router (Defaults to 'theory' per audit state machine)
  const [daySubStep, setDaySubStep] = useState<DaySubStep>('theory');
  const [activeConceptId, setActiveConceptId] = useState<string | undefined>(undefined);
  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(undefined);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string | undefined>(undefined);

  // Celebratory completion state
  const [completedDayModule, setCompletedDayModule] = useState<any | null>(null);

  // Active module lookup
  const currentModule = useMemo(() => {
    return getModuleById(progress.currentDayId) || ALL_MODULES[0];
  }, [progress.currentDayId]);

  // Persist progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Synchronize state with URL hash (Back/Forward buttons & deep links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'roadmap') {
        setActiveView('roadmap');
        return;
      }
      if (hash === 'erd') {
        setActiveView('erd');
        return;
      }
      if (hash === 'playground') {
        setActiveView('playground');
        return;
      }

      // Format: day/:dayId(/overview | /theory(/:conceptId) | /practice(/:taskId) | /challenge)
      const parts = hash.split('/');
      if (parts[0] === 'day' && parts[1]) {
        const dayId = parts[1];
        setProgress((prev) => ({ ...prev, currentDayId: dayId }));
        setActiveView('learn');

        const step = parts[2] as DaySubStep | undefined;
        if (step === 'overview') {
          setDaySubStep('overview');
        } else if (step === 'theory') {
          setDaySubStep('theory');
          if (parts[3]) setActiveConceptId(parts[3]);
        } else if (step === 'practice') {
          setDaySubStep('practice');
          if (parts[3]) setActiveTaskId(parts[3]);
        } else if (step === 'challenge') {
          setDaySubStep('challenge');
        } else {
          setDaySubStep('theory');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state changes back to URL hash
  const syncHash = (
    view: MainView,
    dayId?: string,
    subStep?: DaySubStep,
    conceptId?: string,
    taskId?: string
  ) => {
    let target = '#/roadmap';
    if (view === 'roadmap') target = '#/roadmap';
    else if (view === 'erd') target = '#/erd';
    else if (view === 'playground') target = '#/playground';
    else if (view === 'learn') {
      const d = dayId || progress.currentDayId;
      if (subStep === 'overview') target = `#/day/${d}/overview`;
      else if (subStep === 'challenge') target = `#/day/${d}/challenge`;
      else if (subStep === 'practice') target = taskId ? `#/day/${d}/practice/${taskId}` : `#/day/${d}/practice`;
      else target = conceptId ? `#/day/${d}/theory/${conceptId}` : `#/day/${d}/theory`;
    }

    if (window.location.hash !== target) {
      window.location.hash = target;
    }
  };

  // Navigation handlers - default resumes where the user left off
  const handleSelectDayFromRoadmap = (
    dayId: string,
    initialStep?: DaySubStep,
    conceptId?: string,
    taskId?: string
  ) => {
    const targetModule = getModuleById(dayId) || ALL_MODULES[0];
    let step = initialStep;
    let cId = conceptId;
    let tId = taskId;

    // If step was not explicitly provided or details are missing, resolve the user's resume point for that day
    if (!step || (!cId && step === 'theory') || (!tId && step === 'practice')) {
      const resume = resolveDayResumeTarget(targetModule, progress);
      step = step || resume.subStep;
      cId = cId || resume.conceptId;
      tId = tId || resume.taskId;
    }

    const effectiveStep = step || 'theory';

    setProgress((prev) =>
      recordDayLocation(
        {
          ...prev,
          currentDayId: dayId
        },
        dayId,
        {
          conceptId: cId,
          subStep: effectiveStep,
          taskId: tId
        }
      )
    );

    setActiveConceptId(cId);
    setActiveTaskId(tId);
    setDaySubStep(effectiveStep);
    setActiveView('learn');
    syncHash('learn', dayId, effectiveStep, cId, tId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModuleFromHeader = (moduleId: string) => {
    const targetModule = getModuleById(moduleId) || ALL_MODULES[0];
    const resume = resolveDayResumeTarget(targetModule, progress);
    handleSelectDayFromRoadmap(moduleId, resume.subStep, resume.conceptId, resume.taskId);
  };

  const handleMarkTaskCompleted = (taskId: string) => {
    setProgress((prev) => markTaskComplete(prev, taskId));
  };

  const handleCompleteDay = (xpEarned: number = 100) => {
    setProgress((prev) => markDayComplete(prev, currentModule.id, xpEarned));
    setCompletedDayModule(currentModule);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas is unsupported
    }
  };

  const handleNextDayFromModal = () => {
    const nextIndex = ALL_MODULES.findIndex((m) => m.id === currentModule.id) + 1;
    if (nextIndex < ALL_MODULES.length) {
      const nextMod = ALL_MODULES[nextIndex];
      handleSelectDayFromRoadmap(nextMod.id, 'theory');
    } else {
      setActiveView('roadmap');
    }
    setCompletedDayModule(null);
  };

  const handleReset = () => {
    if (window.confirm('Reset all course progress, XP, and streak? This action cannot be undone.')) {
      const fresh = resetProgress();
      setProgress(fresh);
      engine.reset();
      setActiveView('roadmap');
    }
  };

  // Concept lookup for Theory view
  const currentConcept = useMemo(() => {
    if (!activeConceptId) return currentModule.concepts[0];
    return (
      currentModule.concepts.find((c) => c.id === activeConceptId) ||
      currentModule.concepts[0]
    );
  }, [currentModule, activeConceptId]);

  const currentConceptIndex = useMemo(() => {
    return currentModule.concepts.findIndex((c) => c.id === currentConcept.id);
  }, [currentModule, currentConcept]);

  const hasNextDay = useMemo(() => {
    const idx = ALL_MODULES.findIndex((m) => m.id === currentModule.id);
    return idx >= 0 && idx < ALL_MODULES.length - 1;
  }, [currentModule.id]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col antialiased selection:bg-indigo-900/60 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeView={activeView}
        daySubStep={daySubStep}
        currentModule={currentModule}
        activeConceptTitle={currentConcept.title}
        activeTaskTitle={activeTaskTitle}
        allModules={ALL_MODULES}
        onSelectModule={handleSelectModuleFromHeader}
        streakDays={progress.streakDays}
        totalXp={progress.xp}
        onNavigateRoadmap={() => {
          setActiveView('roadmap');
          syncHash('roadmap');
        }}
        onTogglePlayground={() => {
          const next = activeView === 'playground' ? 'roadmap' : 'playground';
          setActiveView(next);
          syncHash(next);
        }}
        isPlaygroundActive={activeView === 'playground'}
        onToggleErd={() => {
          const next = activeView === 'erd' ? 'roadmap' : 'erd';
          setActiveView(next);
          syncHash(next);
        }}
        isErdActive={activeView === 'erd'}
        onResetProgress={handleReset}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <ErrorBoundary>
          {/* VIEW 1: Clean Homepage (The Roadmap & Execution Path) */}
          {activeView === 'roadmap' && (
            <PrismaRoadmapView
              milestones={ALL_MILESTONES}
              modules={ALL_MODULES}
              progress={progress}
              onSelectDay={handleSelectDayFromRoadmap}
            />
          )}

          {/* VIEW 2: In-Day Sequential Learning Flow */}
          {activeView === 'learn' && (
            <>
              {/* SUB-VIEW 2A: Day Overview (Briefing, concepts, and launch actions) */}
              {daySubStep === 'overview' && (
                <DayOverviewView
                  module={currentModule}
                  progress={progress}
                  onBackToRoadmap={() => {
                    setActiveView('roadmap');
                    syncHash('roadmap');
                  }}
                  onStartTheory={(conceptId) => {
                    setActiveConceptId(conceptId);
                    setDaySubStep('theory');
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        conceptId,
                        subStep: 'theory'
                      })
                    );
                    syncHash('learn', currentModule.id, 'theory', conceptId);
                  }}
                  onStartPractice={(conceptId, taskId) => {
                    setActiveConceptId(conceptId);
                    setActiveTaskId(taskId);
                    setDaySubStep('practice');
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        conceptId,
                        subStep: 'practice',
                        taskId
                      })
                    );
                    syncHash('learn', currentModule.id, 'practice', conceptId, taskId);
                  }}
                  onStartChallenge={() => {
                    setDaySubStep('challenge');
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        subStep: 'challenge'
                      })
                    );
                    syncHash('learn', currentModule.id, 'challenge');
                  }}
                />
              )}

              {/* SUB-VIEW 2B: Concept Theory (Screen A: What problem does this solve, Pattern, Interactive widget, Quick check) */}
              {daySubStep === 'theory' && (
                <ConceptTheoryView
                  module={currentModule}
                  concept={currentConcept}
                  conceptIndex={currentConceptIndex >= 0 ? currentConceptIndex : 0}
                  totalConcepts={currentModule.concepts.length}
                  isCompleted={currentConcept.tasks.every((t) =>
                    progress.completedTaskIds.includes(t.id)
                  )}
                  onBackToOverview={() => {
                    setActiveView('roadmap');
                    syncHash('roadmap');
                  }}
                  onStartPractice={(conceptId, taskId) => {
                    if (conceptId) setActiveConceptId(conceptId);
                    if (taskId) setActiveTaskId(taskId);
                    setDaySubStep('practice');
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        conceptId,
                        subStep: 'practice',
                        taskId
                      })
                    );
                    syncHash('learn', currentModule.id, 'practice', conceptId, taskId);
                  }}
                  onSelectConcept={(conceptId) => {
                    setActiveConceptId(conceptId);
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        conceptId,
                        subStep: 'theory'
                      })
                    );
                    syncHash('learn', currentModule.id, 'theory', conceptId);
                  }}
                />
              )}

              {/* SUB-VIEW 2C: Practice Task / Challenge Split-Pane Workspace (Screen B: Left instructions only, Right Monaco + Console) */}
              {(daySubStep === 'practice' || daySubStep === 'challenge') && (
                <LearningWorkspace
                  module={currentModule}
                  engine={engine}
                  initialConceptId={activeConceptId}
                  initialTaskId={activeTaskId}
                  onViewTheory={(conceptId) => {
                    setActiveConceptId(conceptId);
                    setDaySubStep('theory');
                    setProgress((prev) =>
                      recordDayLocation(prev, currentModule.id, {
                        conceptId,
                        subStep: 'theory'
                      })
                    );
                    syncHash('learn', currentModule.id, 'theory', conceptId);
                  }}
                  onBackToOverview={() => {
                    setActiveView('roadmap');
                    syncHash('roadmap');
                  }}
                  onCompleteDay={handleCompleteDay}
                  isTaskCompleted={(id) => checkTaskCompleted(progress, id)}
                  onMarkTaskCompleted={handleMarkTaskCompleted}
                  onActiveTaskChange={(taskTitle, conceptTitle, conceptId, taskId) => {
                    setActiveTaskTitle(taskTitle);
                    if (conceptId || taskId) {
                      setProgress((prev) =>
                        recordDayLocation(prev, currentModule.id, {
                          conceptId,
                          subStep: daySubStep,
                          taskId
                        })
                      );
                    }
                  }}
                />
              )}
            </>
          )}

          {/* VIEW 3: Live Schema ERD Visualizer */}
          {activeView === 'erd' && (
            <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-hidden">
              <ErdVisualizer ast={schemaAst} />
            </div>
          )}

          {/* VIEW 4: Free-form Sandbox Playground */}
          {activeView === 'playground' && <SandboxPlayground engine={engine} />}
        </ErrorBoundary>
      </main>

      {/* Day Completion Celebratory Modal */}
      {completedDayModule && (
        <DayCompleteModal
          module={completedDayModule}
          xpEarned={100}
          onNextDay={handleNextDayFromModal}
          onClose={() => setCompletedDayModule(null)}
          hasNextDay={hasNextDay}
        />
      )}
    </div>
  );
}
