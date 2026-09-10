import React, { useState } from 'react';
import { ModuleData, MilestoneData } from '../../types/curriculum';
import { UserProgressState, isDayUnlocked, isDayCompleted } from '../../lib/progress/storage';
import { RoadmapStageBlock } from './RoadmapStageBlock';
import { Lock, Award } from 'lucide-react';

interface PrismaRoadmapViewProps {
  milestones: MilestoneData[];
  modules: ModuleData[];
  progress: UserProgressState;
  onSelectDay: (
    dayId: string,
    initialStep?: 'overview' | 'theory' | 'practice' | 'challenge',
    conceptId?: string,
    taskId?: string
  ) => void;
}

export const PrismaRoadmapView: React.FC<PrismaRoadmapViewProps> = ({
  milestones,
  modules,
  progress,
  onSelectDay
}) => {
  // Find first uncompleted and unlocked day as initial active day
  const defaultDay =
    modules.find(m => isDayUnlocked(progress, m.id, modules) && !isDayCompleted(progress, m.id)) ||
    modules[0];
  const [selectedDayId, setSelectedDayId] = useState<string>(defaultDay?.id || 'day-01');
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const handleDayClick = (dayId: string) => {
    if (isDayUnlocked(progress, dayId, modules)) {
      setSelectedDayId(dayId);
      setLockedNotice(null);
    } else {
      const targetMod = modules.find(m => m.id === dayId);
      const dayNum = targetMod?.day || '';
      setLockedNotice(`Complete earlier days to unlock Day ${dayNum}.`);
      setTimeout(() => setLockedNotice(null), 3500);
    }
  };

  return (
    <div className="relative flex-1 bg-[#060B13] text-slate-100 overflow-y-auto min-h-screen selection:bg-sky-900/60 selection:text-white">
      {/* Toast alert for locked day clicks */}
      {lockedNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-300 shadow-2xl backdrop-blur-md">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-sans font-medium text-xs">{lockedNotice}</span>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Continuous Vertical Spine passing down the center of entire page */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-12 w-[2px] bg-sky-900/40 pointer-events-none z-0" />

      {/* ----------------------------------------------------------------- */}
      {/* VERTICAL ROADMAP SPINES & STAGE BLOCKS                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 pt-12 sm:pt-16 pb-28 px-4 max-w-4xl mx-auto flex flex-col items-center">
        {milestones.map((milestone, idx) => {
          const stageModules = modules.filter(m => milestone.moduleIds.includes(m.id));

          return (
            <React.Fragment key={milestone.id}>
              {/* Stage Block: Stage Card + Stem + Day Track + (Day Box with Caret if selected) */}
              <RoadmapStageBlock
                milestone={milestone}
                modules={stageModules}
                allModules={modules}
                progress={progress}
                selectedDayId={selectedDayId}
                onSelectDayId={handleDayClick}
                onStartLearning={onSelectDay}
              />

              {/* Connecting stem to next stage */}
              {idx < milestones.length - 1 && (
                <div className="w-[2px] h-14 sm:h-16 bg-sky-900/60 shrink-0" />
              )}
            </React.Fragment>
          );
        })}

        {/* Stem down to graduation completion node */}
        <div className="w-[2px] h-12 bg-sky-900/60 shrink-0" />

        {/* Final Graduation Node */}
        <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl border border-sky-950/90 bg-[#07111f] p-5 sm:p-6 text-center shadow-xl">
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-sky-400 font-mono text-xs font-bold uppercase tracking-widest">
            Prisma Production Mastery
          </div>
          <p className="text-slate-400 text-xs mt-1.5 font-sans leading-relaxed">
            From declarative schema modeling to high-scale enterprise REST APIs.
          </p>
        </div>
      </div>
    </div>
  );
};
