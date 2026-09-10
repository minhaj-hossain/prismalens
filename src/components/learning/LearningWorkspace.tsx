import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ModuleData, PracticeTask } from '../../types/curriculum';
import { InBrowserPrismaEngine, ExecutionResult } from '../../lib/prisma-engine/proxy-executor';
import { validateTaskSubmission, TaskValidationResult } from '../../lib/prisma-engine/validator';
import { PREVIEW_TABLES } from './InteractiveTableExplorer';
import {
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckSquare,
  Square,
  Terminal,
  Code2,
  BookOpen,
  Database,
  FileText,
  Layers,
  Lightbulb,
  Maximize2,
  Minimize2
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

  const steps: StepDef[] = useMemo(() => {
    const list: StepDef[] = [];
    module.concepts.forEach((concept, cIdx) => {
      concept.tasks.forEach((task, tIdx) => {
        list.push({
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
      list.push({
        type: 'challenge',
        taskIndex: tIdx,
        totalTasksInConcept: module.challenge.tasks.length,
        task,
        conceptTitle: module.challenge.title
      });
    });
    return list;
  }, [module]);

  // Determine starting index
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

  // Sync index when external props change
  useEffect(() => {
    if (initialTaskId) {
      const idx = steps.findIndex((s) => s.task.id === initialTaskId);
      if (idx !== -1) {
        setCurrentStepIdx(idx);
        return;
      }
    }
    if (initialConceptId) {
      const idx = steps.findIndex((s) => s.conceptId === initialConceptId);
      if (idx !== -1) {
        setCurrentStepIdx(idx);
      }
    }
  }, [initialConceptId, initialTaskId, steps]);

  const activeStep = steps[currentStepIdx] || steps[0];
  const activeTask = activeStep.task;
  const activeConcept =
    activeStep.type === 'concept'
      ? module.concepts[activeStep.conceptIndex ?? 0]
      : null;

  // Left Pane View Modes: 'brief' | 'table' | 'schema'
  const [leftTab, setLeftTab] = useState<'brief' | 'table' | 'schema'>('brief');

  // Table selection in database explorer
  const targetModelNormalized = (activeTask.targetModel || 'student').toLowerCase();
  const initialTableKey = targetModelNormalized.endsWith('s')
    ? targetModelNormalized
    : `${targetModelNormalized}s`;
  const [selectedTableKey, setSelectedTableKey] = useState<string>(
    PREVIEW_TABLES[initialTableKey] ? initialTableKey : 'students'
  );
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false);

  // Editor and execution states
  const [editorCode, setEditorCode] = useState<string>(activeTask.initialCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [validationResult, setValidationResult] = useState<TaskValidationResult | null>(null);
  const [consoleTab, setConsoleTab] = useState<'grid' | 'sql' | 'type'>('grid');
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  // Help Accordion & Copy States
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when active step changes
  useEffect(() => {
    setEditorCode(activeTask.initialCode);
    setExecutionResult(null);
    setValidationResult(null);
    setConsoleTab('grid');
    setIsHelpOpen(false);
    setLeftTab('brief');
    setIsDrawerCollapsed(false);

    const norm = (activeTask.targetModel || 'student').toLowerCase();
    const key = norm.endsWith('s') ? norm : `${norm}s`;
    if (PREVIEW_TABLES[key]) {
      setSelectedTableKey(key);
    } else {
      setSelectedTableKey('students');
    }

    if (onActiveTaskChange) {
      onActiveTaskChange(
        `Task ${activeStep.taskIndex + 1}: ${activeTask.title}`,
        activeStep.conceptTitle
      );
    }
  }, [currentStepIdx, activeTask.id]);

  // Execute Query
  const handleRunQuery = async () => {
    setIsExecuting(true);
    setIsDrawerCollapsed(false);
    try {
      const execRes = await engine.executeCode(editorCode, 'editor');
      setExecutionResult(execRes);

      const valRes = validateTaskSubmission(activeTask, editorCode, execRes);
      setValidationResult(valRes);

      if (valRes.passed) {
        onMarkTaskCompleted(activeTask.id);
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        data: null,
        error: {
          name: 'ExecutionError',
          code: 'EXEC_ERR',
          message: err.message || 'Execution failed'
        },
        inferredType: 'never',
        queryLogs: [],
        durationMs: 0
      });
      setValidationResult({
        passed: false,
        feedbackMessage: err.message || 'Runtime execution error',
        checklist: []
      });
    } finally {
      setIsExecuting(false);
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
  }, [editorCode]);

  // Navigation handlers
  const handleNextStep = () => {
    if (activeStep.type === 'concept') {
      const isLastTaskInConcept = activeStep.taskIndex === activeStep.totalTasksInConcept - 1;
      if (isLastTaskInConcept) {
        const hasMoreConcepts =
          activeStep.conceptIndex !== undefined &&
          activeStep.conceptIndex + 1 < module.concepts.length;

        if (hasMoreConcepts && onViewTheory) {
          const nextConcept = module.concepts[activeStep.conceptIndex! + 1];
          onViewTheory(nextConcept.id);
          return;
        } else if (!hasMoreConcepts) {
          const challengeIdx = steps.findIndex((s) => s.type === 'challenge');
          if (challengeIdx !== -1) {
            setCurrentStepIdx(challengeIdx);
            return;
          }
        }
      }
    }

    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep.taskIndex > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    } else if (activeConcept && onViewTheory) {
      onViewTheory(activeConcept.id);
    } else if (onBackToOverview) {
      onBackToOverview();
    }
  };

  // Quick chips insertion into editor
  const handleInsertQuickToken = (token: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setEditorCode((prev) => prev + ` ${token} `);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = editorCode.substring(0, start) + token + editorCode.substring(end);
    setEditorCode(updated);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + token.length;
      }
    }, 0);
  };

  // Format Code Helper
  const handleFormatCode = () => {
    const cleaned = editorCode
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
    setEditorCode(cleaned);
  };

  // Copy Code Helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  // Tab key handling for 2 spaces indentation
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updated = editorCode.substring(0, start) + '  ' + editorCode.substring(end);
      setEditorCode(updated);

      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const isCurrentTaskPassed = isTaskCompleted(activeTask.id) || !!validationResult?.passed;
  const isLastTaskInConcept =
    activeStep.type === 'concept' &&
    activeStep.taskIndex === activeStep.totalTasksInConcept - 1;
  const hasMoreConcepts =
    activeStep.conceptIndex !== undefined &&
    activeStep.conceptIndex + 1 < module.concepts.length;

  // Metadata calculations for Task criteria
  const targetModelDisplay = (activeTask.targetModel || 'student').toLowerCase();
  const targetTableDisplay = targetModelDisplay.endsWith('s')
    ? targetModelDisplay
    : `${targetModelDisplay}s`;
  const targetColumnsDisplay =
    activeTask.validation?.requiredFieldsInSelect && activeTask.validation.requiredFieldsInSelect.length > 0
      ? activeTask.validation.requiredFieldsInSelect.join(', ')
      : 'all';
  const expectedRowsDisplay = activeTask.validation?.expectedRowCount
    ? `${activeTask.validation.expectedRowCount} rows`
    : activeTask.validation?.requiredMethod === 'findUnique'
    ? '1 row'
    : '5 rows';

  // Active Database Table
  const currentTable = PREVIEW_TABLES[selectedTableKey] || PREVIEW_TABLES.students;

  // Line numbers
  const lineCount = Math.max(editorCode.split('\n').length, 12);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Parameterized SQL for Explain Query tab
  const derivedSql = useMemo(() => {
    if (executionResult?.queryLogs && executionResult.queryLogs.length > 0) {
      return executionResult.queryLogs[executionResult.queryLogs.length - 1]?.sql?.rawSql;
    }
    return `SELECT "${targetColumnsDisplay}" FROM "${targetTableDisplay}" LIMIT 5;`;
  }, [executionResult, targetColumnsDisplay, targetTableDisplay]);

  const isColHighlighted = (colName: string) => {
    const hl = activeTask.validation?.requiredFieldsInSelect || [];
    return hl.some((h) => h.toLowerCase() === colName.toLowerCase());
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-[#050A14] text-slate-100 overflow-hidden font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-HEADER: Task Breadcrumb, Progress Stepper & Actions       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="h-11 px-4 sm:px-6 bg-[#071120] border-b border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
        {/* Left: Task Indicator & Title */}
        <div className="flex items-center space-x-3 truncate">
          <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-sky-300 font-bold text-[11px] uppercase tracking-wider">
            {activeStep.type === 'challenge'
              ? `Day ${module.day} Challenge`
              : `Task ${activeStep.taskIndex + 1}/${activeStep.totalTasksInConcept}`}
          </span>
          <span className="text-slate-400 font-medium truncate hidden md:inline">
            {activeStep.conceptTitle}
          </span>
        </div>

        {/* Right: Stepper Dots & Review Theory Button */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Progress dots for current concept */}
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: activeStep.totalTasksInConcept }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeStep.taskIndex
                    ? 'bg-sky-400 ring-2 ring-sky-400/40 w-4'
                    : idx < activeStep.taskIndex
                    ? 'bg-emerald-400'
                    : 'bg-slate-700'
                }`}
                title={`Task ${idx + 1}`}
              />
            ))}
          </div>

          {activeConcept && onViewTheory && (
            <button
              onClick={() => onViewTheory(activeConcept.id)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#050B15] hover:bg-sky-950/50 border border-sky-950 hover:border-sky-800 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Review Theory</span>
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN SPLIT-PANE STUDIO: Left (Brief & DB) / Right (Code IDE)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-sky-950/80">
        {/* ============================================================= */}
        {/* LEFT PANE: Tabbed Brief, Database Table & Schema Blueprint     */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[45%] flex flex-col h-full bg-[#050C18] overflow-hidden">
          {/* View Mode Navigation Tabs */}
          <div className="h-10 px-4 bg-[#071324] border-b border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setLeftTab('brief')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                  leftTab === 'brief'
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Task Brief</span>
              </button>

              <button
                onClick={() => setLeftTab('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                  leftTab === 'table'
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Database Table</span>
                <span className="text-[10px] opacity-75 font-normal">
                  ({currentTable.rows.length})
                </span>
              </button>

              <button
                onClick={() => setLeftTab('schema')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                  leftTab === 'schema'
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Prisma Schema</span>
              </button>
            </div>

            {/* If in Table view: table dropdown button */}
            {leftTab === 'table' && (
              <div className="relative">
                <button
                  onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#040A14] border border-sky-900/60 hover:border-sky-700 text-sky-300 text-[11px] font-bold cursor-pointer"
                >
                  <span>🗄️ {selectedTableKey}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isTableDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsTableDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-40 w-44 rounded-xl bg-[#071324] border border-sky-900/80 shadow-2xl p-1 space-y-0.5">
                      {Object.keys(PREVIEW_TABLES).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedTableKey(key);
                            setIsTableDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                            key === selectedTableKey
                              ? 'bg-sky-500/20 text-sky-300 font-bold'
                              : 'text-slate-300 hover:bg-sky-950/40'
                          }`}
                        >
                          <span>{key}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {PREVIEW_TABLES[key].rows.length}r
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Left Pane Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* VIEW A: TASK BRIEF */}
            {leftTab === 'brief' && (
              <div className="space-y-6">
                {/* Main Problem Headline */}
                <div className="space-y-3">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {activeTask.description || activeTask.title}
                  </h1>

                  {/* Clean Inline Criteria Badges (No Clunky Card Nesting) */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#071426] border border-sky-900/60 text-slate-300">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">
                        Table:
                      </span>
                      <span className="text-white font-bold">{targetTableDisplay}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#071426] border border-sky-900/60 text-slate-300">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">
                        Columns:
                      </span>
                      <span className="text-sky-300 font-bold">{targetColumnsDisplay}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#071426] border border-sky-900/60 text-slate-300">
                      <span className="text-slate-500 text-[10px] uppercase font-bold">
                        Expected:
                      </span>
                      <span className="text-white font-bold">{expectedRowsDisplay}</span>
                    </div>

                    <button
                      onClick={() => setLeftTab('table')}
                      className="px-2.5 py-1 rounded-lg text-xs text-sky-400 hover:text-sky-300 hover:underline transition cursor-pointer"
                    >
                      View Table →
                    </button>
                  </div>
                </div>

                {/* Directives Checklist */}
                {activeTask.instructions && activeTask.instructions.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                      Requirements
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {activeTask.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start space-x-2.5 leading-relaxed">
                          {isCurrentTaskPassed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          )}
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collapsible Hints & Reference Solution Accordion */}
                <div className="rounded-xl border border-sky-950 bg-[#07101E] overflow-hidden">
                  <button
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-xs font-mono text-slate-300 hover:text-white hover:bg-sky-950/30 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4 text-sky-400" />
                      <span className="font-semibold">Need a hint or reference solution?</span>
                    </div>
                    {isHelpOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isHelpOpen && (
                    <div className="p-4 border-t border-sky-950/80 space-y-3.5 bg-[#050C17] text-xs">
                      {activeTask.hints && activeTask.hints.length > 0 && (
                        <div className="space-y-2">
                          {activeTask.hints.map((hint, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-2 text-slate-300 leading-relaxed font-sans"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>
                                <strong className="text-amber-300 font-mono">
                                  Hint {hint.level}:
                                </strong>{' '}
                                {hint.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTask.solutionCode && (
                        <div className="pt-2 border-t border-sky-950 space-y-2">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-slate-400 uppercase font-bold">
                              Reference Solution
                            </span>
                            <button
                              onClick={() => setEditorCode(activeTask.solutionCode)}
                              className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition cursor-pointer"
                            >
                              Apply to Editor
                            </button>
                          </div>
                          <pre className="p-3 rounded-lg bg-[#02050B] border border-sky-950 text-sky-200 font-mono text-xs overflow-x-auto whitespace-pre">
                            {activeTask.solutionCode}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mini Database Peek at Bottom of Brief */}
                <div className="rounded-xl border border-sky-950/80 bg-[#060D1A] p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span>🗄️</span>
                      <span className="font-bold text-slate-200">{currentTable.name} Table Peek</span>
                    </div>
                    <button
                      onClick={() => setLeftTab('table')}
                      className="text-sky-400 hover:text-sky-300 text-[11px] cursor-pointer"
                    >
                      Open full table view →
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Columns: {currentTable.columns.map((c) => c.name).join(', ')} ({currentTable.rows.length} total rows)
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: FULL DATABASE TABLE VIEW */}
            {leftTab === 'table' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs pb-1">
                  <span>
                    Showing table <strong className="text-sky-300">{currentTable.name}</strong> ({currentTable.rows.length} rows)
                  </span>
                  <span className="text-[11px] text-slate-500">PostgreSQL Mock Engine</span>
                </div>

                <div className="rounded-xl border border-sky-950 bg-[#060D1A] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-sky-950/80 bg-[#081324]">
                          {currentTable.columns.map((col, idx) => {
                            const isHl = isColHighlighted(col.name);
                            return (
                              <th
                                key={idx}
                                className={`py-2.5 px-3.5 text-xs font-semibold tracking-wider select-none ${
                                  isHl
                                    ? 'bg-sky-500/15 text-sky-300 border-b-2 border-sky-400'
                                    : 'text-slate-300'
                                }`}
                              >
                                <div className="flex items-center space-x-1.5">
                                  <span>{col.name}</span>
                                  {col.isPk && (
                                    <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                                      PK
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 font-normal">
                                    {col.type}
                                  </span>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-950/60">
                        {currentTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-sky-950/30 transition-colors">
                            {row.map((val, cIdx) => {
                              const colName = currentTable.columns[cIdx]?.name;
                              const isHl = colName ? isColHighlighted(colName) : false;
                              return (
                                <td
                                  key={cIdx}
                                  className={`py-2.5 px-3.5 text-xs select-text ${
                                    isHl
                                      ? 'bg-sky-500/5 text-sky-200 font-semibold'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {val === null ? (
                                    <span className="text-slate-600 italic">null</span>
                                  ) : typeof val === 'boolean' ? (
                                    <span className={val ? 'text-emerald-400' : 'text-slate-500'}>
                                      {String(val)}
                                    </span>
                                  ) : (
                                    <span>{String(val)}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW C: PRISMA SCHEMA BLUEPRINT */}
            {leftTab === 'schema' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-400 text-xs pb-1 flex items-center justify-between">
                  <span>schema.prisma Definition</span>
                  <span className="text-sky-400">Model: {currentTable.name}</span>
                </div>
                <div className="rounded-xl border border-sky-950 bg-[#060D1A] p-4 overflow-x-auto">
                  <pre className="text-emerald-300 whitespace-pre leading-relaxed">
                    {currentTable.schemaText}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT PANE: Code IDE Editor + Docked Reactive Results Drawer  */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[55%] flex flex-col h-full bg-[#03070E] overflow-hidden">
          {/* Top IDE Window Header */}
          <div className="h-10 px-4 bg-[#071222] border-b border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
            {/* Window Dots & Tab */}
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="flex items-center space-x-2 pl-2 border-l border-sky-950">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-white font-bold text-xs">query.ts</span>
                <span className="text-[10px] text-slate-500">Prisma Client</span>
              </div>
            </div>

            {/* Actions: Format, Copy, Reset */}
            <div className="flex items-center space-x-1 text-slate-400">
              <button
                onClick={handleFormatCode}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-sky-950/40 hover:text-slate-200 transition cursor-pointer text-xs"
                title="Format Code"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">Format</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-sky-950/40 hover:text-slate-200 transition cursor-pointer text-xs"
                title="Copy Code"
              >
                {hasCopiedCode ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{hasCopiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setEditorCode(activeTask.initialCode)}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-sky-950/40 hover:text-slate-200 transition cursor-pointer text-xs"
                title="Reset to Initial Code"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Editor Body: Full Proportional Height */}
          <div className="flex-1 flex overflow-hidden bg-[#02050B]">
            {/* Line Numbers */}
            <div className="w-10 py-4 select-none text-right pr-3 font-mono text-xs text-slate-600 bg-[#010408] border-r border-sky-950/60 shrink-0">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code Input */}
            <textarea
              ref={textareaRef}
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              onKeyDown={handleEditorKeyDown}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent font-mono text-xs sm:text-sm text-sky-100 placeholder-slate-600 outline-none resize-none leading-6 overflow-auto"
              placeholder="// Write your Prisma query here..."
            />
          </div>

          {/* Editor Status & Action Bar */}
          <div className="px-4 py-2.5 bg-[#06101E] border-t border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
            {/* Left: Quick tokens scroll bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[50%] py-0.5">
              <span className="text-slate-500 font-bold uppercase text-[10px] mr-0.5 shrink-0">
                QUICK:
              </span>
              {['prisma', targetModelDisplay, 'findMany', 'findUnique', 'where', 'select', 'include'].map(
                (chip) => (
                  <button
                    key={chip}
                    onClick={() => handleInsertQuickToken(chip)}
                    className="px-2 py-0.5 rounded bg-[#09172B] hover:bg-sky-900/40 text-sky-300 border border-sky-900/60 text-[10px] shrink-0 transition hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {chip}
                  </button>
                )
              )}
            </div>

            {/* Right: Back & Run Buttons */}
            <div className="flex items-center space-x-2 ml-auto shrink-0">
              <span className="text-slate-500 text-[11px] hidden xl:inline mr-2">
                Ctrl + Enter to run
              </span>

              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#091526] hover:bg-[#0E203A] border border-sky-950 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 disabled:bg-sky-800 text-slate-950 font-mono font-bold text-xs shadow-md shadow-sky-400/20 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isExecuting ? 'Running...' : 'Run & Check'}</span>
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* DOCKED ADAPTIVE RESULTS DRAWER                            */}
          {/* ───────────────────────────────────────────────────────── */}
          {/* IDLE STATE: Sleek 36px bottom bar */}
          {!executionResult && !isExecuting && (
            <div className="h-9 px-4 bg-[#050E1B] border-t border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-slate-300">Results Console</span>
                <span className="text-slate-500 hidden sm:inline">
                  — Press Ctrl + Enter or click Run & Check
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Ready</span>
            </div>
          )}

          {/* EXECUTING STATE */}
          {isExecuting && (
            <div className="h-10 px-4 bg-[#050E1B] border-t border-sky-950/80 flex items-center space-x-3 shrink-0 font-mono text-xs text-sky-400">
              <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <span>Executing Prisma query against PostgreSQL engine...</span>
            </div>
          )}

          {/* EXECUTED RESULTS DRAWER */}
          {executionResult && !isExecuting && (
            <div
              className={`border-t border-sky-950/80 bg-[#040A14] flex flex-col transition-all duration-200 ${
                isDrawerCollapsed ? 'h-9' : 'h-[44%] min-h-[220px]'
              }`}
            >
              {/* Drawer Bar */}
              <div className="h-9 px-4 bg-[#071324] border-b border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                  {validationResult?.passed ? (
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tests Passed ({executionResult.durationMs}ms)</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Query Incomplete</span>
                    </div>
                  )}
                </div>

                {/* Tabs & Collapse Toggle */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setConsoleTab('grid')}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                        consoleTab === 'grid'
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Output Grid
                    </button>

                    <button
                      onClick={() => setConsoleTab('sql')}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                        consoleTab === 'sql'
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Compiled SQL
                    </button>

                    <button
                      onClick={() => setConsoleTab('type')}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                        consoleTab === 'type'
                          ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Inferred Type
                    </button>
                  </div>

                  <button
                    onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                    className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    title={isDrawerCollapsed ? 'Expand Drawer' : 'Collapse Drawer'}
                  >
                    {isDrawerCollapsed ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              {!isDrawerCollapsed && (
                <div className="flex-1 p-3 sm:p-4 bg-[#03070E] overflow-y-auto space-y-3 flex flex-col justify-between">
                  {/* Feedback Message if Failed */}
                  {!validationResult?.passed && (
                    <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs font-sans leading-relaxed">
                      {validationResult?.feedbackMessage || executionResult.error?.message}
                    </div>
                  )}

                  {/* TAB 1: Output Grid */}
                  {consoleTab === 'grid' && (
                    <div className="flex-1 overflow-auto rounded-lg border border-sky-950/80 bg-[#060D1A]">
                      {executionResult.data ? (
                        Array.isArray(executionResult.data) ? (
                          executionResult.data.length > 0 ? (
                            <table className="w-full text-left font-mono text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-sky-950 bg-[#081324] text-sky-400">
                                  {Object.keys(executionResult.data[0]).map((k) => (
                                    <th key={k} className="py-2 px-3 font-semibold">
                                      {k}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-sky-950/60">
                                {executionResult.data.map((row: any, rIdx: number) => (
                                  <tr key={rIdx} className="hover:bg-sky-950/30">
                                    {Object.values(row).map((v: any, cIdx: number) => (
                                      <td key={cIdx} className="py-2 px-3 text-slate-300">
                                        {v === null
                                          ? 'null'
                                          : typeof v === 'object'
                                          ? JSON.stringify(v)
                                          : String(v)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="p-4 text-slate-500 font-mono text-xs">
                              0 rows returned.
                            </div>
                          )
                        ) : typeof executionResult.data === 'object' ? (
                          <div className="p-3 font-mono text-xs text-slate-200">
                            <pre className="text-sky-300">
                              {JSON.stringify(executionResult.data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div className="p-3 text-emerald-300 font-mono text-xs">
                            {String(executionResult.data)}
                          </div>
                        )
                      ) : (
                        <div className="p-4 text-slate-500 font-mono text-xs">
                          No rows returned by this query.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Compiled SQL */}
                  {consoleTab === 'sql' && (
                    <div className="p-3 rounded-lg border border-sky-950 bg-[#060D1A] font-mono text-xs space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        Generated PostgreSQL Query
                      </div>
                      <pre className="text-emerald-300 whitespace-pre overflow-x-auto">
                        {derivedSql}
                      </pre>
                    </div>
                  )}

                  {/* TAB 3: Type Inspector */}
                  {consoleTab === 'type' && (
                    <div className="p-3 rounded-lg border border-sky-950 bg-[#060D1A] font-mono text-xs space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">
                        Inferred TypeScript Return Type
                      </div>
                      <pre className="text-sky-300 whitespace-pre overflow-x-auto">
                        {executionResult.inferredType}
                      </pre>
                    </div>
                  )}

                  {/* Advance CTA Button when passed */}
                  {isCurrentTaskPassed && (
                    <div className="pt-2 border-t border-sky-950">
                      {activeStep.type === 'concept' ? (
                        isLastTaskInConcept ? (
                          hasMoreConcepts ? (
                            <button
                              onClick={handleNextStep}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-sky-400/20 transition hover:scale-[1.01] cursor-pointer"
                            >
                              <span>Next: Concept {activeStep.conceptIndex! + 2} Theory</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleNextStep}
                              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-amber-400/20 transition hover:scale-[1.01] cursor-pointer"
                            >
                              <span>Start Day {module.day} Final Challenge</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )
                        ) : (
                          <button
                            onClick={handleNextStep}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-sky-400/20 transition hover:scale-[1.01] cursor-pointer"
                          >
                            <span>
                              Next Task ({activeStep.taskIndex + 2}/{activeStep.totalTasksInConcept})
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => onCompleteDay(100)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-emerald-400/20 transition hover:scale-[1.01] cursor-pointer"
                        >
                          <Trophy className="w-4 h-4 text-slate-950" />
                          <span>Claim 100 XP & Finish Day {module.day}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
