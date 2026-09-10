import React, { useState } from 'react';
import { ModuleData, MilestoneData } from '../../types/curriculum';
import {
  UserProgressState,
  calculateOverallProgress,
  calculateDayProgress,
  isDayUnlocked,
  isDayCompleted,
  deriveLastPosition,
  DerivedPosition
} from '../../lib/progress/storage';
import {
  Check,
  Lock,
  ArrowRight,
  Sparkles,
  Trophy,
  BookOpen,
  Code2,
  Layers,
  ChevronRight,
  Flame,
  Zap,
  Info
} from 'lucide-react';

interface PrismaRoadmapViewProps {
  milestones: MilestoneData[];
  modules: ModuleData[];
  progress: UserProgressState;
  onSelectDay: (dayId: string, initialStep?: 'overview' | 'theory' | 'practice' | 'challenge', conceptId?: string, taskId?: string) => void;
}

export const PrismaRoadmapView: React.FC<PrismaRoadmapViewProps> = ({
  milestones,
  modules,
  progress,
  onSelectDay
}) => {
  // Selected day for the hanging callout card (defaults to active or first uncompleted day)
  const overall = calculateOverallProgress(progress, modules);
  const derived = deriveLastPosition(progress, modules);

  const [selectedDayId, setSelectedDayId] = useState<string>(
    progress.currentDayId || derived.dayId || 'day-01'
  );
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const selectedModule = modules.find(m => m.id === selectedDayId) || modules[0];
  const selectedDayProgress = calculateDayProgress(progress, selectedModule);

  // SVG Progress Ring calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall.percentage / 100) * circumference;

  const handleDayClick = (dayId: string) => {
    const unlocked = isDayUnlocked(progress, dayId, modules);
    if (!unlocked) {
      const mod = modules.find(m => m.id === dayId);
      const modIdx = modules.findIndex(m => m.id === dayId);
      const prevMod = modIdx > 0 ? modules[modIdx - 1] : null;
      setLockedNotice(`Day ${mod?.day || ''} is locked. Complete ${prevMod?.title || 'previous day'} to unlock!`);
      setTimeout(() => setLockedNotice(null), 3500);
      return;
    }
    setSelectedDayId(dayId);
  };

  const handleContinueWhereLeftOff = () => {
    onSelectDay(derived.dayId, derived.step, derived.conceptId, derived.taskId);
  };

  const scrollToExecutionPath = () => {
    const el = document.getElementById('execution-path');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 bg-[#0B0F19] text-slate-100 overflow-y-auto pb-24 font-mono text-xs selection:bg-indigo-900/60 selection:text-white">
      {/* Toast alert for locked day clicks */}
      {lockedNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-300 shadow-2xl backdrop-blur-md">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-sans font-medium text-xs">{lockedNotice}</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* HERO SECTION                                                       */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 max-w-6xl mx-auto border-b border-slate-800/80">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Column: Headline & Direct CTAs */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            {/* Monospace Crumb */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>PRISMALENS / CURRICULUM ROADMAP</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              From <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">schema.prisma</span> to production queries with confidence.
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Master Prisma ORM from schema to SQL. Hands-on queries, compile-time type safety, relational modeling, and generated SQL inspection directly in your browser.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleContinueWhereLeftOff}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-sans font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Continue where you left off</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToExecutionPath}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-sans font-medium text-sm transition cursor-pointer"
              >
                <span>View full plan</span>
              </button>
            </div>
          </div>

          {/* Right Column: Circular Progress % Ring */}
          <div className="shrink-0 p-6 rounded-2xl bg-[#111827]/80 border border-slate-800/80 shadow-2xl backdrop-blur-sm flex flex-col items-center justify-center min-w-[260px]">
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#1F2937"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active Progress Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="url(#prismaGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="prismaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5A67D8" />
                    <stop offset="100%" stopColor="#00B4D8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered Percentage */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-sans text-3xl font-extrabold text-white">
                  {overall.percentage}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Mastered
                </span>
              </div>
            </div>

            {/* Stage Summary Under Ring */}
            <div className="mt-4 text-center">
              <div className="font-sans font-semibold text-xs text-indigo-300">
                Stage {overall.currentStageNumber} of 4 · 14 Days
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {overall.completedTasks} of {overall.totalTasks} tasks completed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* EXECUTION PATH (ROADMAP SPINES & DAY LEAVES)                        */}
      {/* ------------------------------------------------------------------- */}
      <section id="execution-path" className="pt-12 px-4 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            EXECUTION PATH
          </span>
          <h2 className="font-sans text-2xl font-bold text-white mt-2">
            Structured 14-Day Production Mastery
          </h2>
          <p className="font-sans text-xs text-slate-400 max-w-md mx-auto mt-1">
            Follow the spine from relational fundamentals to enterprise-grade publishing REST APIs.
          </p>
        </div>

        {/* The Main Execution Spine */}
        <div className="relative">
          {/* Vertical Spine Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-12 w-[2px] bg-gradient-to-b from-indigo-500/40 via-slate-700 to-slate-800 z-0" />

          {/* Milestones Loop */}
          <div className="space-y-16 relative z-10">
            {milestones.map((milestone) => {
              const stageModules = modules.filter(m => milestone.moduleIds.includes(m.id));
              const stageCompletedDays = stageModules.filter(m => isDayCompleted(progress, m.id)).length;
              const isStageCompleted = stageCompletedDays === stageModules.length;
              const isStageActive = stageModules.some(m => m.id === selectedDayId);
              const stagePercentage = stageModules.length > 0
                ? Math.round((stageCompletedDays / stageModules.length) * 100)
                : 0;

              return (
                <div key={milestone.id} className="flex flex-col items-center">
                  {/* Stage Node Card */}
                  <div
                    className={`w-full max-w-md p-4 rounded-2xl border text-center transition-all duration-200 shadow-xl ${
                      isStageActive
                        ? 'bg-[#111827] border-indigo-500/60 shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                        : isStageCompleted
                        ? 'bg-[#0E1524] border-emerald-500/40'
                        : 'bg-[#0D121F] border-slate-800'
                    }`}
                  >
                    {/* Stage Badge & Status */}
                    <div className="flex items-center justify-between mb-2 text-[10px]">
                      <span className="font-bold tracking-wider text-slate-400 uppercase">
                        {milestone.daysRange}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                          isStageCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isStageActive
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isStageCompleted
                          ? 'Completed'
                          : isStageActive
                          ? 'Stage Active'
                          : `${stagePercentage}% complete`}
                      </span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-white">
                      Stage {milestone.number}: {milestone.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-400 mt-1 line-clamp-2">
                      {milestone.description}
                    </p>

                    {/* Stage Progress Bar */}
                    <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isStageCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                        }`}
                        style={{ width: `${stagePercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Connecting Stem */}
                  <div className="w-[2px] h-6 bg-slate-700" />

                  {/* Day Leaf Nodes (Circular Buttons) */}
                  <div className="flex items-center justify-center space-x-4 sm:space-x-6 py-2">
                    {stageModules.map((mod) => {
                      const dayCompleted = isDayCompleted(progress, mod.id);
                      const dayUnlocked = isDayUnlocked(progress, mod.id, modules);
                      const isCurrent = mod.id === selectedDayId;

                      return (
                        <div key={mod.id} className="relative group">
                          <button
                            onClick={() => handleDayClick(mod.id)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-600 text-white border-2 border-indigo-400 ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-600/40 scale-110'
                                : dayCompleted
                                ? 'bg-emerald-950/70 text-emerald-300 border-2 border-emerald-500/80 shadow-md shadow-emerald-500/20 hover:scale-105'
                                : dayUnlocked
                                ? 'bg-[#111827] text-slate-200 border-2 border-slate-700 hover:border-indigo-400 hover:scale-105 hover:-translate-y-0.5'
                                : 'bg-[#0B0F19] text-slate-600 border border-slate-800 opacity-40 cursor-not-allowed'
                            }`}
                            title={`Day ${mod.day}: ${mod.shortTitle || mod.title}`}
                          >
                            {dayCompleted ? (
                              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                            ) : !dayUnlocked ? (
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <span>{mod.day}</span>
                            )}
                          </button>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                            <div className="bg-[#161F33] text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] whitespace-nowrap shadow-xl">
                              Day {mod.day}: {mod.shortTitle || mod.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ----------------------------------------------------------- */}
                  {/* HANGING ACTIVE STAGE CALLOUT CARD                           */}
                  {/* (Hangs off the currently selected stage)                    */}
                  {/* ----------------------------------------------------------- */}
                  {isStageActive && (
                    <div className="w-full max-w-xl mt-4 relative animate-in fade-in zoom-in-95 duration-200">
                      {/* 45-degree Diamond Pointer */}
                      <div className="w-3.5 h-3.5 bg-[#111827] border-l border-t border-indigo-500/40 transform rotate-45 mx-auto -mb-2 z-20 relative" />

                      <div className="rounded-2xl border border-indigo-500/40 bg-[#111827] p-5 shadow-2xl relative z-10 space-y-4">
                        {/* Callout Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                              <Sparkles className="w-3 h-3" />
                              <span>Current Active Day</span>
                            </div>
                            <h4 className="font-sans font-bold text-base text-white mt-0.5">
                              Day {selectedModule.day}: {selectedModule.title}
                            </h4>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                              selectedDayProgress.isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}
                          >
                            {selectedDayProgress.isCompleted ? '✓ Completed' : `${selectedDayProgress.percentage}% Done`}
                          </span>
                        </div>

                        {/* Concept Pills (1-click navigation into Theory or Practice) */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Concepts in this Day:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedModule.concepts.map((concept, cIdx) => {
                              const conceptCompleted = concept.tasks.every(t =>
                                progress.completedTaskIds.includes(t.id)
                              );

                              return (
                                <div
                                  key={concept.id}
                                  className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                                >
                                  <div className="flex items-center space-x-2 truncate mr-2">
                                    <span
                                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold ${
                                        conceptCompleted
                                          ? 'bg-emerald-500/20 text-emerald-400'
                                          : 'bg-indigo-500/20 text-indigo-300'
                                      }`}
                                    >
                                      {conceptCompleted ? '✓' : cIdx + 1}
                                    </span>
                                    <span className="truncate text-slate-300 font-sans text-xs">
                                      {concept.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-1 shrink-0">
                                    <button
                                      onClick={() => onSelectDay(selectedModule.id, 'theory', concept.id)}
                                      className="px-2 py-1 rounded text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                                      title="Read Theory"
                                    >
                                      Theory
                                    </button>
                                    <button
                                      onClick={() => onSelectDay(selectedModule.id, 'practice', concept.id)}
                                      className="px-2 py-1 rounded text-[10px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 cursor-pointer"
                                      title="Start Practice"
                                    >
                                      Practice
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Day Challenge Row */}
                        <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                              <Trophy className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-sans font-semibold text-xs text-white">
                                {selectedModule.challenge.title}
                              </div>
                              <div className="text-[10px] text-slate-400 font-sans line-clamp-1">
                                {selectedModule.challenge.scenario}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onSelectDay(selectedModule.id, 'challenge')}
                            className="px-3 py-1 rounded-lg text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium shrink-0 cursor-pointer"
                          >
                            Challenge
                          </button>
                        </div>

                        {/* Direct CTA to enter day */}
                        <div className="pt-1 flex items-center justify-end">
                          <button
                            onClick={() => onSelectDay(selectedModule.id, 'overview')}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                          >
                            <span>Open Day Overview</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
