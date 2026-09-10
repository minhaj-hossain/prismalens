import React from 'react';
import { StepBreakdown } from '../../types/curriculum';
import { ChevronRight, Layers } from 'lucide-react';

interface StepBreakdownViewProps {
  steps: StepBreakdown[];
}

export const StepBreakdownView: React.FC<StepBreakdownViewProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Layers className="w-4 h-4 text-indigo-400" />
        <span>Step-by-Step Pedagogical Dissection</span>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="rounded-lg border border-slate-800 bg-[#111827]/70 p-3.5 transition hover:border-slate-700"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
                {step.stepNumber}
              </span>
              <h4 className="text-sm font-semibold text-slate-200">
                {step.stepTitle}
              </h4>
            </div>

            <div className="rounded bg-[#0B0F19] border border-slate-800/80 p-2.5 my-2 overflow-x-auto font-mono text-xs text-slate-300">
              <pre className="whitespace-pre">{step.codeSnippet}</pre>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-1 flex items-start space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{step.explanation}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
