import React from 'react';
import { ModuleData, Concept } from '../../types/curriculum';
import { UserProgressState, calculateDayProgress, isTaskCompleted } from '../../lib/progress/storage';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Code2,
  CheckCircle2,
  Trophy,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';

interface DayOverviewViewProps {
  module: ModuleData;
  progress: UserProgressState;
  onBackToRoadmap: () => void;
  onStartTheory: (conceptId: string) => void;
  onStartPractice: (conceptId: string, taskId?: string) => void;
  onStartChallenge: () => void;
}

export const DayOverviewView: React.FC<DayOverviewViewProps> = ({
  module,
  progress,
  onBackToRoadmap,
  onStartTheory,
  onStartPractice,
  onStartChallenge
}) => {
  const stats = calculateDayProgress(progress, module);

  // Determine the next uncompleted concept or task
  let nextAction = {
    type: 'theory' as 'theory' | 'practice' | 'challenge',
    conceptId: module.concepts[0]?.id,
    label: `Start Concept 1: ${module.concepts[0]?.title || 'Theory'}`
  };

  let allConceptsFinished = true;
  for (let i = 0; i < module.concepts.length; i++) {
    const c = module.concepts[i];
    const anyTaskDone = c.tasks.some(t => progress.completedTaskIds.includes(t.id));
    const allTasksDone = c.tasks.every(t => progress.completedTaskIds.includes(t.id));

    if (!allTasksDone) {
      allConceptsFinished = false;
      if (!anyTaskDone) {
        nextAction = {
          type: 'theory',
          conceptId: c.id,
          label: `Learn Concept ${i + 1}: ${c.title}`
        };
      } else {
        const firstUncompleted = c.tasks.find(t => !progress.completedTaskIds.includes(t.id));
        nextAction = {
          type: 'practice',
          conceptId: c.id,
          label: `Resume Practice: ${firstUncompleted?.title || c.title}`
        };
      }
      break;
    }
  }

  if (allConceptsFinished) {
    nextAction = {
      type: 'challenge',
      conceptId: '',
      label: `Tackle Day ${module.day} Final Challenge`
    };
  }

  return (
    <div className="flex-1 bg-[#0B0F19] text-slate-100 overflow-y-auto p-4 sm:p-8 font-mono text-xs selection:bg-indigo-900/60 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToRoadmap}
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white font-sans text-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Roadmap</span>
          </button>

          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            DAY {module.day} OF 14
          </span>
        </div>

        {/* Day Header Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs font-sans">
              <span className="flex items-center space-x-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>~{module.estimatedMinutes} minutes</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>{module.concepts.length} Core Concepts</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-[#0B0F19] px-2.5 py-1 rounded-lg border border-slate-800">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{stats.totalTasks} Practice Tasks</span>
              </span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Day {module.day}: {module.title}
            </h1>
            <p className="font-sans text-sm text-slate-300 leading-relaxed max-w-3xl">
              {module.description}
            </p>
          </div>

          {/* Progress Bar & Quick Start CTA */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 max-w-md space-y-1.5">
              <div className="flex justify-between text-[11px] font-sans">
                <span className="text-slate-400">Day Completion</span>
                <span className="font-bold text-indigo-400">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (nextAction.type === 'theory') onStartTheory(nextAction.conceptId);
                else if (nextAction.type === 'practice') onStartPractice(nextAction.conceptId);
                else onStartChallenge();
              }}
              className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-sans font-semibold text-xs shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
            >
              <span>{nextAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning Concepts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-lg font-bold text-white">
              Pedagogical Learning Path
            </h2>
            <span className="text-[11px] text-slate-400">
              Concept Theory → Hands-on Tasks → Day Challenge
            </span>
          </div>

          <div className="space-y-3">
            {module.concepts.map((concept, cIdx) => {
              const completedTasksCount = concept.tasks.filter(t =>
                progress.completedTaskIds.includes(t.id)
              ).length;
              const isConceptComplete = completedTasksCount === concept.tasks.length;

              return (
                <div
                  key={concept.id}
                  className={`rounded-2xl border p-5 transition-all duration-150 ${
                    isConceptComplete
                      ? 'bg-[#0E1524] border-emerald-500/40'
                      : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Info */}
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isConceptComplete
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {isConceptComplete ? <Check className="w-4 h-4" /> : cIdx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                            Concept {cIdx + 1}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] text-slate-400">
                            {completedTasksCount} of {concept.tasks.length} tasks completed
                          </span>
                        </div>
                        <h3 className="font-sans font-bold text-base text-white">
                          {concept.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-400 max-w-xl">
                          {concept.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => onStartTheory(concept.id)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0B0F19] hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-sans text-xs transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Theory</span>
                      </button>

                      <button
                        onClick={() => onStartPractice(concept.id)}
                        className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-sans text-xs font-semibold transition cursor-pointer ${
                          isConceptComplete
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/60'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Practice ({concept.tasks.length})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Day Milestone Challenge Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#161B26] p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Day Final Challenge
                    </span>
                    <h3 className="font-sans font-bold text-base text-white">
                      {module.challenge.title}
                    </h3>
                    <p className="font-sans text-xs text-slate-400 max-w-xl">
                      {module.challenge.scenario}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onStartChallenge}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs transition shadow-lg shadow-amber-500/20 shrink-0 self-end md:self-center cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Enter Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Takeaways */}
        {module.completionLearnings && module.completionLearnings.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
            <div className="font-sans font-bold text-xs text-slate-300 uppercase tracking-wider">
              🎯 Day {module.day} Learning Objectives
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {module.completionLearnings.map((learning, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs font-sans text-slate-400">
                  <span className="text-indigo-400 font-bold shrink-0">•</span>
                  <span>{learning}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
