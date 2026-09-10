import React, { useState } from 'react';
import { ConceptMCQ } from '../../types/curriculum';
import { HelpCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface ConceptMCQCardProps {
  mcq: ConceptMCQ;
  onAnswered?: (isCorrect: boolean) => void;
}

export const ConceptMCQCard: React.FC<ConceptMCQCardProps> = ({ mcq, onAnswered }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedIndex(idx);
    setHasSubmitted(true);
    const correct = idx === mcq.correctIndex;
    if (onAnswered) onAnswered(correct);
  };

  const isCorrect = selectedIndex === mcq.correctIndex;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] p-4 my-6 shadow-md">
      <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2.5">
        <HelpCircle className="w-4 h-4" />
        <span>Concept Check Knowledge Quiz</span>
      </div>

      <p className="text-sm font-medium text-slate-200 mb-3.5 leading-snug">
        {mcq.question}
      </p>

      <div className="space-y-2">
        {mcq.options.map((opt, idx) => {
          let btnStyle = 'border-slate-800 bg-[#0B0F19] text-slate-300 hover:border-slate-700 hover:bg-slate-800/40';

          if (hasSubmitted) {
            if (idx === mcq.correctIndex) {
              btnStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-medium';
            } else if (idx === selectedIndex) {
              btnStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-300';
            } else {
              btnStyle = 'border-slate-800/50 bg-[#0B0F19]/50 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={hasSubmitted}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs leading-relaxed transition flex items-start space-x-2.5 cursor-pointer ${btnStyle}`}
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700/60 text-[10px] font-mono shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{opt}</span>

              {hasSubmitted && idx === mcq.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {hasSubmitted && idx === selectedIndex && idx !== mcq.correctIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {hasSubmitted && (
        <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed border flex items-start space-x-2 ${
          isCorrect
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
            {mcq.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
