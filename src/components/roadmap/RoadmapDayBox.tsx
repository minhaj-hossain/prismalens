import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ModuleData, MilestoneData } from '../../types/curriculum';
import {
  UserProgressState,
  calculateDayProgress,
  isDayUnlocked,
  isDayCompleted,
  isConceptCompleted
} from '../../lib/progress/storage';
import { Check, Lock, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

interface RoadmapDayBoxProps {
  modules: ModuleData[];
  milestones: MilestoneData[];
  progress: UserProgressState;
  selectedDayId: string;
  onSelectDayId: (dayId: string) => void;
  onStartLearning: (dayId: string, step?: 'overview' | 'theory' | 'practice' | 'challenge', conceptId?: string, taskId?: string) => void;
}

interface CardItem {
  id: string;
  number: number;
  text: string;
  conceptId: string;
  taskId: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export const RoadmapDayBox: React.FC<RoadmapDayBoxProps> = ({
  modules,
  milestones,
  progress,
  selectedDayId,
  onSelectDayId,
  onStartLearning
}) => {
  const selectedModule = modules.find(m => m.id === selectedDayId) || modules[0];
  const dayProgress = calculateDayProgress(progress, selectedModule);

  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  // Position caret directly below the active day button
  const updateCaretPosition = useCallback(() => {
    const btn = buttonRefs.current[selectedDayId];
    const box = boxRef.current;
    if (btn && box) {
      const btnRect = btn.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const relativeX = btnRect.left + btnRect.width / 2 - boxRect.left;
      // Clamp within box boundaries so caret doesn't overflow rounded corners
      const clamped = Math.max(32, Math.min(boxRect.width - 32, relativeX));
      setCaretLeft(clamped);
    }
  }, [selectedDayId]);

  useEffect(() => {
    updateCaretPosition();
    const box = boxRef.current;
    let ro: ResizeObserver | null = null;
    if (box && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateCaretPosition();
      });
      ro.observe(box);
    }

    // Secondary timer to guarantee measurement after layout & fonts settle
    const timer = setTimeout(updateCaretPosition, 100);

    window.addEventListener('resize', updateCaretPosition);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateCaretPosition);
    };
  }, [updateCaretPosition]);

  // Scroll active day into view on track
  useEffect(() => {
    const btn = buttonRefs.current[selectedDayId];
    if (btn && trackRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedDayId]);

  // Clean title for display (e.g. "SELECT Queries 101" style)
  const cleanTitle = (selectedModule.shortTitle || selectedModule.title)
    .replace(/^Day\s+\d+\s*[-—:]\s*/i, '');

  // Extract concept items for the day card: only concept names, no tasks
  const cardConcepts = selectedModule.concepts;
  const firstIncompleteConceptIndex = cardConcepts.findIndex(
    c => !isConceptCompleted(progress, c)
  );

  const cardItems: CardItem[] = cardConcepts.map((c, idx) => {
    const isCompleted = isConceptCompleted(progress, c);
    const isCurrent = idx === (firstIncompleteConceptIndex >= 0 ? firstIncompleteConceptIndex : 0);
    const nextTask = c.tasks.find(t => !progress.completedTaskIds.includes(t.id)) || c.tasks[0];

    return {
      id: c.id,
      number: idx + 1,
      text: c.title,
      conceptId: c.id,
      taskId: nextTask?.id || '',
      isCompleted,
      isCurrent
    };
  });

  // Calculate challenge completion
  const challengeTasks = selectedModule.challenge?.tasks || [];
  const challengeCompleted = challengeTasks.length > 0 && challengeTasks.every(t => progress.completedTaskIds.includes(t.id));
  const challengePercentage = challengeCompleted
    ? 100
    : challengeTasks.length > 0
    ? Math.round((challengeTasks.filter(t => progress.completedTaskIds.includes(t.id)).length / challengeTasks.length) * 100)
    : 0;

  // Active milestone for current day
  const activeMilestone = milestones.find(m => m.moduleIds.includes(selectedModule.id)) || milestones[0];
  const stageModules = modules.filter(m => activeMilestone.moduleIds.includes(m.id));
  const stageCompletedDays = stageModules.filter(m => isDayCompleted(progress, m.id)).length;
  const isStageCompleted = stageModules.length > 0 && stageCompletedDays === stageModules.length;
  const stagePercentage = stageModules.length > 0
    ? Math.round((stageCompletedDays / stageModules.length) * 100)
    : 0;

  // Group modules into stages for the track
  const stageGroups = milestones.map(m => ({
    milestone: m,
    mods: modules.filter(mod => m.moduleIds.includes(mod.id))
  }));

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* ----------------------------------------------------------------- */}
      {/* Continuous Vertical Spine Line (Passing behind whole component)  */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-12 -bottom-16 w-[2px] bg-sky-900/40 pointer-events-none z-0" />

      {/* ----------------------------------------------------------------- */}
      {/* STAGE CARD (From Reference Image)                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl border-2 border-sky-400/90 shadow-[0_0_35px_rgba(56,189,248,0.25)] bg-[#071322] px-6 py-5 sm:px-8 sm:py-6 text-center transition-all">
        <div className="text-sky-400 font-mono text-xs font-bold tracking-widest uppercase">
          STAGE {activeMilestone.number} · {isStageCompleted ? 'COMPLETED' : 'ACTIVE'}
        </div>
        <h2 className="font-mono font-bold text-white text-base sm:text-lg mt-2 leading-snug">
          {activeMilestone.title}
        </h2>
        <div className="text-slate-400 font-mono text-xs mt-1.5">
          {activeMilestone.daysRange}
        </div>
        <div className="border-t border-sky-950/80 my-3.5" />
        <div className="text-slate-300 font-mono text-xs font-medium">
          {stagePercentage}% complete
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* VERTICAL CONNECTING STEM                                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 w-[2px] h-10 sm:h-12 bg-sky-900/60" />

      {/* ----------------------------------------------------------------- */}
      {/* TOP TRACK: Circular Day Step Buttons with Dividers               */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={trackRef}
        className="relative z-10 w-full overflow-x-auto no-scrollbar py-2 px-2 sm:px-4 flex items-center justify-center gap-2 sm:gap-3"
      >
        {stageGroups.map((group, gIdx) => (
          <React.Fragment key={group.milestone.id}>
            {/* Stage divider line between distinct stages if multiple on same track */}
            {gIdx > 0 && (
              <div className="w-[2px] h-8 sm:h-9 bg-sky-900/60 my-auto mx-1.5 sm:mx-2.5 shrink-0" />
            )}

            {/* Days in this Stage */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {group.mods.map(mod => {
                const isSelected = mod.id === selectedDayId;
                const completed = isDayCompleted(progress, mod.id);
                const unlocked = isDayUnlocked(progress, mod.id, modules);

                return (
                  <React.Fragment key={mod.id}>
                    {/* Symmetrical central divider spine after Day 4 (like in the screenshot) */}
                    {mod.day === 5 && (
                      <div className="w-[2px] h-8 sm:h-9 bg-sky-900/60 my-auto mx-1 sm:mx-2 shrink-0" />
                    )}

                    <button
                      ref={el => { buttonRefs.current[mod.id] = el; }}
                      onClick={() => {
                        if (unlocked) {
                          onSelectDayId(mod.id);
                        }
                      }}
                      disabled={!unlocked}
                      title={`Day ${mod.day}: ${mod.shortTitle || mod.title}`}
                      className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-105 z-20'
                          : completed
                          ? 'bg-[#081827] text-emerald-400 border border-emerald-500/50 hover:border-emerald-400 hover:scale-105'
                          : unlocked
                          ? 'bg-[#081322] text-slate-300 border border-sky-950/80 hover:border-sky-500/50 hover:text-white hover:scale-105'
                          : 'bg-[#050B14] text-slate-600 border border-slate-900/80 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {completed && !isSelected ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : !unlocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                      ) : (
                        mod.day
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* THE BOX (Card Container with Caret, 2x2 Grid, and Challenge Bar) */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={boxRef}
        className="relative z-10 w-full mt-4 rounded-2xl border border-sky-500/30 bg-[#081220]/95 backdrop-blur-md p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(14,165,233,0.12)] transition-all"
      >
        {/* Pointer Beak / Caret pointing up to selected day circle */}
        {caretLeft !== null && (
          <div
            className="absolute -top-2 w-4 h-4 bg-[#081220] border-t border-l border-sky-500/30 rotate-45 z-20 pointer-events-none transition-all duration-300 ease-out"
            style={{ left: `${caretLeft}px`, transform: 'translateX(-50%) rotate(45deg)' }}
          />
        )}

        {/* Box Header: "Day X – Title" on Left, "0% done" on Right */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="font-mono font-bold text-sm sm:text-base md:text-lg text-white tracking-wide truncate">
              Day {selectedModule.day} – {cleanTitle}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono font-semibold text-xs sm:text-sm text-sky-400">
              {dayProgress.percentage}% done
            </span>
          </div>
        </div>

        {/* 2x2 Concept / Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {cardItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onStartLearning(selectedModule.id, 'practice', item.conceptId, item.taskId)}
              className="group relative rounded-xl p-4 sm:p-4.5 bg-[#0a1526] border border-sky-950/60 hover:border-sky-500/40 hover:bg-[#0e1e35] transition-all duration-200 cursor-pointer flex items-start gap-3 sm:gap-3.5 shadow-sm hover:shadow-md hover:shadow-sky-500/5"
            >
              {/* Circular Number Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold mt-0.5 transition-colors ${
                  item.isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                    : item.isCurrent
                    ? 'bg-sky-400 text-slate-950 shadow-sm shadow-sky-400/40 ring-2 ring-sky-400/30'
                    : 'border border-sky-900/80 bg-[#060c16] text-slate-400 group-hover:border-sky-500/50 group-hover:text-sky-300'
                }`}
              >
                {item.isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  item.number
                )}
              </div>

              {/* Text Description */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400/80 group-hover:text-sky-300 mb-0.5 transition-colors">
                  Concept {item.number}
                </div>
                <p className="font-sans font-medium text-xs sm:text-[13px] text-slate-200 group-hover:text-white leading-snug transition-colors">
                  {item.text}
                </p>
              </div>

              {/* Action arrow indicator on hover */}
              <div className="hidden group-hover:flex items-center text-sky-400 shrink-0 self-center">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Dashed Horizontal Line Divider */}
        <div className="border-t border-dashed border-sky-900/40 my-4 sm:my-5" />

        {/* Stage Challenge Row */}
        <div
          onClick={() => onStartLearning(selectedModule.id, 'challenge')}
          className="flex items-center justify-between py-1 group cursor-pointer -mx-2 px-2 rounded-lg hover:bg-sky-500/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base select-none">🏆</span>
            <span className="font-mono font-medium text-xs sm:text-sm text-sky-400 group-hover:text-sky-300 transition-colors">
              Stage challenge
            </span>
            {selectedModule.challenge?.title && (
              <span className="hidden md:inline font-sans text-xs text-slate-400 line-clamp-1 max-w-sm">
                · {selectedModule.challenge.title}
              </span>
            )}
          </div>

          <div className="font-mono font-semibold text-xs sm:text-sm text-sky-400 shrink-0">
            {challengePercentage}% done
          </div>
        </div>
      </div>
    </div>
  );
};
