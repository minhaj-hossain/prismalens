import React from 'react';
import { ModuleData, MilestoneInfo } from '../../types/curriculum';
import {
  Map,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

interface RoadmapModalProps {
  milestones: MilestoneInfo[];
  modules: ModuleData[];
  currentModuleId: string;
  isDayCompleted: (moduleId: string) => boolean;
  onSelectModule: (moduleId: string) => void;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  milestones,
  modules,
  currentModuleId,
  isDayCompleted,
  onSelectModule,
  onClose
}) => {
  const totalCompletedDays = modules.filter(m => isDayCompleted(m.id)).length;
  const overallPercent = Math.round((totalCompletedDays / modules.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-[#0B0F19] shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#111827]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">14-Day Production Curriculum Roadmap</h2>
              <p className="text-xs text-slate-400">Zero to Production Enterprise Database Engineer with Prisma v7</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">{totalCompletedDays}/14 Days ({overallPercent}%)</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Roadmap Milestones List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {milestones.map((milestone) => {
            const milestoneModules = modules.filter(m => m.milestoneId === milestone.id);
            const completedInMilestone = milestoneModules.filter(m => isDayCompleted(m.id)).length;
            const milestonePercent = Math.round((completedInMilestone / milestoneModules.length) * 100);

            return (
              <div
                key={milestone.id}
                className="rounded-xl border border-slate-800 bg-[#111827]/70 p-4 space-y-4"
              >
                {/* Milestone Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Milestone {milestone.number}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{milestone.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{milestone.description}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400 font-mono">
                      {completedInMilestone}/{milestoneModules.length} Completed
                    </span>
                    <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${milestonePercent}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Day Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {milestoneModules.map((mod) => {
                    const isCompleted = isDayCompleted(mod.id);
                    const isCurrent = mod.id === currentModuleId;

                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          onSelectModule(mod.id);
                          onClose();
                        }}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-900/20'
                            : isCompleted
                            ? 'bg-[#0B0F19] border-emerald-500/30 hover:border-emerald-500/60'
                            : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-indigo-400">
                              Day {mod.day}
                            </span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">
                                {mod.estimatedMinutes}m
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-semibold text-slate-200 line-clamp-2 mb-2 leading-snug">
                            {mod.title}
                          </h4>
                        </div>

                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{mod.concepts.length} concepts</span>
                          <div className="flex items-center text-indigo-400 group-hover:translate-x-0.5 transition">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
