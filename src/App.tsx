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
  isTaskCompleted as checkTaskCompleted,
  isDayCompleted as checkDayCompleted
} from './lib/progress/storage';
import { Header } from './components/layout/Header';
import { PrismaRoadmapView } from './components/roadmap/PrismaRoadmapView';
import { ConceptTheoryView } from './components/learning/ConceptTheoryView';
import { LearningWorkspace } from './components/learning/LearningWorkspace';
import { ErdVisualizer } from './components/learning/ErdVisualizer';
import { SandboxPlayground } from './components/learning/SandboxPlayground';
import { DayCompleteModal } from './components/learning/DayCompleteModal';

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

  // Navigation handlers - default goes directly to Concept Theory
  const handleSelectDayFromRoadmap = (
    dayId: string,
    initialStep: DaySubStep = 'theory',
    conceptId?: string,
    taskId?: string
  ) => {
    setProgress((prev) => ({
      ...prev,
      currentDayId: dayId
    }));
    setActiveConceptId(conceptId);
    setActiveTaskId(taskId);
    setDaySubStep(initialStep);
    setActiveView('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModuleFromHeader = (moduleId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentDayId: moduleId
    }));
    setActiveConceptId(undefined);
    setActiveTaskId(undefined);
    setDaySubStep('theory');
    setActiveView('learn');
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
        onNavigateRoadmap={() => setActiveView('roadmap')}
        onTogglePlayground={() => {
          setActiveView(activeView === 'playground' ? 'roadmap' : 'playground');
        }}
        isPlaygroundActive={activeView === 'playground'}
        onToggleErd={() => {
          setActiveView(activeView === 'erd' ? 'roadmap' : 'erd');
        }}
        isErdActive={activeView === 'erd'}
        onResetProgress={handleReset}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
            {/* SUB-VIEW 2A: Concept Theory (Screen A: What problem does this solve, Pattern, Interactive widget, Quick check) */}
            {daySubStep === 'theory' && (
              <ConceptTheoryView
                module={currentModule}
                concept={currentConcept}
                conceptIndex={currentConceptIndex >= 0 ? currentConceptIndex : 0}
                totalConcepts={currentModule.concepts.length}
                isCompleted={currentConcept.tasks.every((t) =>
                  progress.completedTaskIds.includes(t.id)
                )}
                onBackToOverview={() => setActiveView('roadmap')}
                onStartPractice={() => {
                  setDaySubStep('practice');
                  setActiveTaskId(undefined);
                }}
                onSelectConcept={(conceptId) => setActiveConceptId(conceptId)}
              />
            )}

            {/* SUB-VIEW 2B: Practice Task / Challenge Split-Pane Workspace (Screen B: Left instructions only, Right Monaco + Console) */}
            {(daySubStep === 'practice' || daySubStep === 'challenge') && (
              <LearningWorkspace
                module={currentModule}
                engine={engine}
                initialConceptId={activeConceptId}
                initialTaskId={activeTaskId}
                onViewTheory={(conceptId) => {
                  setActiveConceptId(conceptId);
                  setDaySubStep('theory');
                }}
                onBackToOverview={() => setActiveView('roadmap')}
                onCompleteDay={handleCompleteDay}
                isTaskCompleted={(id) => checkTaskCompleted(progress, id)}
                onMarkTaskCompleted={handleMarkTaskCompleted}
                onActiveTaskChange={(taskTitle) => setActiveTaskTitle(taskTitle)}
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
