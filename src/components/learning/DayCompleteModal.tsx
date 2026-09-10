import React, { useEffect } from 'react';
import { ModuleData } from '../../types/curriculum';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  BookOpen,
  X
} from 'lucide-react';

interface DayCompleteModalProps {
  module: ModuleData;
  xpEarned: number;
  onNextDay: () => void;
  onClose: () => void;
  hasNextDay: boolean;
}

export const DayCompleteModal: React.FC<DayCompleteModalProps> = ({
  module,
  xpEarned,
  onNextDay,
  onClose,
  hasNextDay
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-[#161F33] to-[#0E1524] p-6 shadow-2xl overflow-hidden font-mono text-xs">
        {/* Background glow circle */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Trophy & Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3 animate-bounce">
            <Trophy className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center space-x-1.5 text-amber-400 font-bold tracking-wide uppercase text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Day {module.day} Complete!</span>
          </div>

          <h2 className="text-xl font-black text-white">{module.title}</h2>
          <p className="text-slate-400 text-xs mt-1 max-w-sm">{module.description}</p>
        </div>

        {/* XP & Rewards Banner */}
        <div className="rounded-xl border border-indigo-500/30 bg-[#0B0F19]/80 p-3.5 flex items-center justify-around mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">XP Awarded</div>
              <div className="text-sm font-bold text-indigo-300">+{xpEarned} XP</div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Streak</div>
              <div className="text-sm font-bold text-amber-300">+1 Day Added</div>
            </div>
          </div>
        </div>

        {/* Key Competencies Mastered */}
        <div className="mb-6 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Competencies Mastered</span>
          </div>
          <div className="space-y-1.5">
            {module.completionLearnings.map((learning, i) => (
              <div
                key={i}
                className="flex items-start space-x-2 p-2 rounded-lg bg-[#0B0F19]/60 border border-slate-800/80 text-slate-300 text-xs leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{learning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium text-xs transition cursor-pointer"
          >
            Review Day Tasks
          </button>

          {hasNextDay && (
            <button
              onClick={onNextDay}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Continue to Day {module.day + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
