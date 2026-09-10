import React, { useState, useEffect } from 'react';
import { ModuleData, PracticeTask, GeneratedSqlResult } from '../../types/curriculum';
import { InBrowserPrismaEngine, ExecutionResult } from '../../lib/prisma-engine/proxy-executor';
import { validateTaskSubmission, TaskValidationResult } from '../../lib/prisma-engine/validator';
import { TaskInstructions } from './TaskInstructions';
import { MonacoCodeEditor } from './MonacoCodeEditor';
import { ResultConsole } from './ResultConsole';
import {
  BookOpen,
  Code2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Zap,
  RotateCcw,
  Play,
  X,
  Database,
  Layers
} from 'lucide-react';

interface LearningWorkspaceProps {
  module: ModuleData;
  engine: InBrowserPrismaEngine;
  initialConceptId?: string;
  initialTaskId?: string;
  onCompleteDay: (xpEarned: number) => void;
  isTaskCompleted: (taskId: string) => boolean;
  onMarkTaskCompleted: (taskId: string) => void;
  onViewTheory?: (conceptId: string) => void;
  onBackToOverview?: () => void;
  onActiveTaskChange?: (taskTitle: string, conceptTitle: string) => void;
}

export const LearningWorkspace: React.FC<LearningWorkspaceProps> = ({
  module,
  engine,
  initialConceptId,
  initialTaskId,
  onCompleteDay,
  isTaskCompleted,
  onMarkTaskCompleted,
  onViewTheory,
  onBackToOverview,
  onActiveTaskChange
}) => {
  // Step navigation: flatten tasks into structured steps
  type StepDef = {
    type: 'concept' | 'challenge';
    conceptIndex?: number;
    conceptId?: string;
    taskIndex: number;
    totalTasksInConcept: number;
    task: PracticeTask;
    conceptTitle: string;
  };

  const steps: StepDef[] = [];
  module.concepts.forEach((concept, cIdx) => {
    concept.tasks.forEach((task, tIdx) => {
      steps.push({
        type: 'concept',
        conceptIndex: cIdx,
        conceptId: concept.id,
        taskIndex: tIdx,
        totalTasksInConcept: concept.tasks.length,
        task,
        conceptTitle: concept.title
      });
    });
  });

  module.challenge.tasks.forEach((task, tIdx) => {
    steps.push({
      type: 'challenge',
      taskIndex: tIdx,
      totalTasksInConcept: module.challenge.tasks.length,
      task,
      conceptTitle: module.challenge.title
    });
  });

  // Calculate starting index
  const getInitialIdx = () => {
    if (initialTaskId) {
      const idx = steps.findIndex((s) => s.task.id === initialTaskId);
      if (idx !== -1) return idx;
    }
    if (initialConceptId) {
      const idx = steps.findIndex((s) => s.conceptId === initialConceptId);
      if (idx !== -1) return idx;
    }
    return 0;
  };

  const [currentStepIdx, setCurrentStepIdx] = useState(getInitialIdx);
  const activeStep = steps[currentStepIdx] || steps[0];
  const activeTask = activeStep.task;
  const activeConcept =
    activeStep.type === 'concept'
      ? module.concepts[activeStep.conceptIndex ?? 0]
      : null;

  // Editor and execution state
  const [editorCode, setEditorCode] = useState<string>(activeTask.initialCode);
  const [activeEditorTab, setActiveEditorTab] = useState<'editor' | 'schema'>(
    activeTask.activeTab || 'editor'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [validationResult, setValidationResult] = useState<TaskValidationResult | null>(null);
  const [consoleTab, setConsoleTab] = useState<'result' | 'sql' | 'type' | 'logs'>('result');

  // Slide-over concept review drawer
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  // Sync state when step changes
  useEffect(() => {
    setEditorCode(activeTask.initialCode);
    setActiveEditorTab(activeTask.activeTab || 'editor');
    setExecutionResult(null);
    setValidationResult(null);
    setConsoleTab('result');

    if (onActiveTaskChange) {
      onActiveTaskChange(
        `Task ${activeStep.taskIndex + 1}: ${activeTask.title}`,
        activeStep.conceptTitle
      );
    }
  }, [currentStepIdx, activeTask.id]);

  // Execute User Query in the in-browser Prisma engine
  const handleRunQuery = async () => {
    setIsExecuting(true);
    try {
      let codeToRun = editorCode;
      if (activeEditorTab === 'schema') {
        engine.updateSchema(editorCode);
        codeToRun = activeTask.solutionCode || 'await prisma.user.findMany()';
      }

      const execRes = await engine.executeCode(codeToRun);
      setExecutionResult(execRes);

      const valRes = validateTaskSubmission(activeTask, codeToRun, execRes);
      setValidationResult(valRes);

      if (valRes.passed) {
        onMarkTaskCompleted(activeTask.id);
      }

      if (execRes.error) {
        setConsoleTab('result');
      } else if (execRes.sql) {
        // Keep current or switch to result
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        error: {
          code: 'EXEC_ERR',
          message: err.message || 'Execution failed'
        },
        logs: [`Fatal runtime error: ${err.message}`]
      });
      setValidationResult({
        passed: false,
        message: err.message,
        checklist: []
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Move to next step in sequence
  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunQuery();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorCode, activeEditorTab]);

  const isCurrentTaskPassed = isTaskCompleted(activeTask.id) || !!validationResult?.passed;
  const isLastTaskInConcept =
    activeStep.type === 'concept' &&
    activeStep.taskIndex === activeStep.totalTasksInConcept - 1;
  const hasMoreConcepts =
    activeStep.conceptIndex !== undefined &&
    activeStep.conceptIndex + 1 < module.concepts.length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#0B0F19] relative">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEFT PANE: Pure Task Instructions, Checklist & Hints         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[420px] xl:w-[460px] border-r border-slate-800 flex flex-col bg-[#0D121F] overflow-y-auto shrink-0">
        {/* Top Header: Step Indicator & Concept Review Button */}
        <div className="p-4 border-b border-slate-800/80 bg-[#111827]/80 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              {activeStep.type === 'challenge'
                ? 'Final Challenge'
                : `Task ${activeStep.taskIndex + 1} of ${activeStep.totalTasksInConcept}`}
            </span>
            <span className="text-slate-400 text-xs truncate max-w-[170px] font-sans font-medium">
              {activeStep.conceptTitle}
            </span>
          </div>

          {/* Quiet Review Concept Button */}
          {activeConcept && (
            <button
              onClick={() => setIsReviewDrawerOpen(true)}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition cursor-pointer"
              title="Review Concept Theory"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-sans">Review</span>
            </button>
          )}
        </div>

        {/* Task Content */}
        <div className="p-4 sm:p-5 space-y-5 flex-1 font-sans">
          {/* Directives Checklist, Descriptions, Multi-level Hints */}
          <TaskInstructions
            task={activeTask}
            checklist={validationResult?.checklist}
            isPassed={isCurrentTaskPassed}
            onApplySolution={() => setEditorCode(activeTask.solutionCode)}
          />

          {/* Next Step Progression Banner when task is passed */}
          {isCurrentTaskPassed && (
            <div className="mt-4 p-4 rounded-xl border animate-in fade-in transition duration-200 bg-[#111827]">
              {activeStep.type === 'concept' ? (
                isLastTaskInConcept ? (
                  hasMoreConcepts ? (
                    // Last task in concept -> Go to Next Concept Theory
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Concept {activeStep.conceptIndex! + 1} Mastered!</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        You have completed all practice tasks for this concept. Ready to explore the next mental model?
                      </p>
                      <button
                        onClick={() => {
                          if (onViewTheory) {
                            onViewTheory(module.concepts[activeStep.conceptIndex! + 1].id);
                          } else {
                            handleNextStep();
                          }
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        <span>Next: Concept {activeStep.conceptIndex! + 2} Theory</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    // Last concept completed -> Proceed to Day Final Challenge
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>All Day {module.day} Concepts Complete!</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Apply everything you learned in the comprehensive Day {module.day} Final Challenge.
                      </p>
                      <button
                        onClick={handleNextStep}
                        className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
                      >
                        <span>Start Final Challenge</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                ) : (
                  // Intermediate task in same concept -> Go to Task 2
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-xs text-emerald-300">
                        Task {activeStep.taskIndex + 1} Passed!
                      </span>
                    </div>
                    <button
                      onClick={handleNextStep}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      <span>Task {activeStep.taskIndex + 2}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              ) : (
                // Challenge step
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>Day {module.day} Challenge Complete!</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have verified full mastery of this day's concepts. 100 XP awarded!
                  </p>
                  <button
                    onClick={() => onCompleteDay(100)}
                    className="w-full flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 cursor-pointer"
                  >
                    <span>Complete Day {module.day} (Claim 100 XP) 🏆</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RIGHT PANE: Monaco Code Editor + Results Console             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#070A10]">
        {/* Editor Controls Bar */}
        <div className="h-11 border-b border-slate-800 bg-[#0E1320] px-3 flex items-center justify-between shrink-0 font-mono text-xs">
          {/* File Tabs */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveEditorTab('editor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg transition cursor-pointer text-xs ${
                activeEditorTab === 'editor'
                  ? 'bg-[#070A10] text-indigo-300 font-semibold border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>index.ts</span>
            </button>

            <button
              onClick={() => setActiveEditorTab('schema')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg transition cursor-pointer text-xs ${
                activeEditorTab === 'schema'
                  ? 'bg-[#070A10] text-emerald-300 font-semibold border-t border-x border-slate-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>schema.prisma</span>
            </button>
          </div>

          {/* Run and Reset Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditorCode(activeTask.initialCode)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer text-xs"
              title="Reset initial code"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline font-sans">Reset</span>
            </button>

            <button
              onClick={handleRunQuery}
              disabled={isExecuting}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-sans font-bold text-xs shadow-md shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
              title="Run Query (Ctrl + Enter)"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{isExecuting ? 'Running...' : 'Run Query ▶'}</span>
              <span className="hidden md:inline text-[10px] opacity-70 font-mono">
                ⌘↵
              </span>
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[200px] overflow-hidden">
          <MonacoCodeEditor
            value={
              activeEditorTab === 'schema'
                ? engine.getSchemaContent()
                : editorCode
            }
            language={activeEditorTab === 'schema' ? 'prisma' : 'typescript'}
            isExecuting={isExecuting}
            onRun={handleRunQuery}
            onReset={() => setEditorCode(activeTask.initialCode)}
            hideHeader={true}
            onChange={(val) => {
              if (activeEditorTab === 'schema') {
                engine.updateSchema(val);
              } else {
                setEditorCode(val);
              }
            }}
          />
        </div>

        {/* Results Console */}
        <ResultConsole
          activeTab={consoleTab}
          onTabChange={setConsoleTab}
          resultData={executionResult?.data}
          sqlResult={executionResult?.sql}
          inferredType={executionResult?.inferredType}
          errorMessage={executionResult?.error?.message}
          errorCode={executionResult?.error?.code}
          isExecuting={isExecuting}
          modelName={activeTask.targetModel}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SLIDE-OVER CONCEPT REVIEW DRAWER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isReviewDrawerOpen && activeConcept && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsReviewDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-lg bg-[#0E1320] border-l border-slate-800 h-full p-6 overflow-y-auto z-10 shadow-2xl space-y-6 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-sm text-white">
                  Concept Review: {activeConcept.title}
                </span>
              </div>
              <button
                onClick={() => setIsReviewDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-indigo-400 font-bold">
                What Problem Does This Solve?
              </div>
              <p className="text-slate-300 leading-relaxed text-sm">
                {activeConcept.theory.summary}
              </p>
            </div>

            {/* Pattern Blueprint */}
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                Target Pattern
              </div>
              <pre className="p-3.5 rounded-xl bg-[#070A10] border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
                {activeConcept.theory.targetHero.code}
              </pre>
            </div>

            {/* What happens in the database */}
            <div className="space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                What happens in the database
              </div>
              <div className="p-3.5 rounded-xl bg-[#070A10] border border-slate-800 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                Prisma constructs optimal parameterized SQL statements with zero injection risk, executing across connection pools and hydrating result rows.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setIsReviewDrawerOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition cursor-pointer"
              >
                Close Drawer
              </button>
              {onViewTheory && (
                <button
                  onClick={() => {
                    setIsReviewDrawerOpen(false);
                    onViewTheory(activeConcept.id);
                  }}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Open Full Theory Page →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
