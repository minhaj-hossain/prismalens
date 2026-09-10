import React, { useState } from 'react';
import { PracticeTask } from '../../types/curriculum';
import { ValidationCheckItem } from '../../lib/prisma-engine/validator';
import {
  CheckSquare,
  Square,
  Lightbulb,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TaskInstructionsProps {
  task: PracticeTask;
  checklist?: ValidationCheckItem[];
  isPassed: boolean;
  onApplySolution?: () => void;
}

export const TaskInstructions: React.FC<TaskInstructionsProps> = ({
  task,
  checklist = [],
  isPassed,
  onApplySolution
}) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);

  const availableHints = task.hints || [];

  const handleNextHint = () => {
    if (hintLevel < availableHints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handleToggleSolution = () => {
    if (!showSolution && !confirmSolution && !isPassed) {
      setConfirmSolution(true);
      return;
    }
    setShowSolution(!showSolution);
    setConfirmSolution(false);
  };

  return (
    <div className="space-y-4">
      {/* Task Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
            task.type === 'guided'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : task.type === 'independent'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            {task.type} Task
          </span>
          <span className="text-xs text-slate-400">Target Model: <span className="font-mono text-slate-200">{task.targetModel}</span></span>
        </div>
        <h3 className="text-base font-bold text-slate-100">{task.title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{task.description}</p>
      </div>

      {/* Instructions Checklist */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <span>Task Directives & Checklist</span>
          {isPassed ? (
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] lowercase font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>all verified</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 lowercase font-mono">run code to test</span>
          )}
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          {task.instructions.map((inst, i) => {
            const correspondingCheck = checklist[i];
            const itemPassed = correspondingCheck ? correspondingCheck.passed : isPassed;

            return (
              <li key={i} className="flex items-start space-x-2 leading-relaxed">
                {itemPassed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span className={itemPassed ? 'text-slate-300' : 'text-slate-300'}>
                  {inst}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Verification Checks if any failed */}
        {checklist.length > 0 && !isPassed && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            {checklist.filter(c => !c.passed).map(c => (
              <div key={c.id} className="flex items-start space-x-1.5 text-[11px] text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{c.label}: {c.explanation}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Multi-Level Hint System */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Hints ({hintLevel}/{availableHints.length})</span>
          </div>

          {hintLevel < availableHints.length ? (
            <button
              onClick={handleNextHint}
              className="text-xs px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
            >
              {hintLevel === 0 ? 'Need a Hint?' : 'Show Next Hint'}
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">All hints revealed</span>
          )}
        </div>

        {hintLevel > 0 && (
          <div className="mt-3 space-y-2">
            {availableHints.slice(0, hintLevel).map((hint) => (
              <div
                key={hint.level}
                className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start space-x-2"
              >
                <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-[10px] font-bold font-mono shrink-0">
                  L{hint.level}
                </span>
                <span>{hint.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solution Peek Accordion */}
      <div className="rounded-xl border border-slate-800 bg-[#111827] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Solution Walkthrough</span>
          </div>

          <button
            onClick={handleToggleSolution}
            className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
          >
            {showSolution ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Solution</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Peek Solution</span>
              </>
            )}
          </button>
        </div>

        {confirmSolution && (
          <div className="mt-3 p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
            <p>Are you sure you want to reveal the solution? Try exploring the hints first to reinforce your learning!</p>
            <div className="flex space-x-2">
              <button
                onClick={() => { setShowSolution(true); setConfirmSolution(false); }}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs cursor-pointer"
              >
                Yes, Show Solution
              </button>
              <button
                onClick={() => setConfirmSolution(false)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Keep Trying
              </button>
            </div>
          </div>
        )}

        {showSolution && (
          <div className="mt-3 space-y-2.5">
            <div className="rounded bg-[#0B0F19] border border-slate-800 p-2.5 overflow-x-auto font-mono text-xs text-slate-200">
              <pre className="whitespace-pre">{task.solutionCode}</pre>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              {task.solutionExplanation}
            </p>
            {onApplySolution && (
              <button
                onClick={onApplySolution}
                className="text-xs px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 cursor-pointer transition"
              >
                Apply Solution to Editor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
