import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ModuleData, MilestoneData } from '../../types/curriculum';
import {
  UserProgressState,
  calculateDayProgress,
  isDayUnlocked,
  isDayCompleted,
  resolveDayResumeTarget
} from '../../lib/progress/storage';
import { Check, Lock, ChevronRight, Play } from 'lucide-react';

interface RoadmapStageBlockProps {
  milestone: MilestoneData;
  modules: ModuleData[];
  allModules: ModuleData[];
  progress: UserProgressState;
  selectedDayId: string;
  onSelectDayId: (dayId: string) => void;
  onStartLearning: (
    dayId: string,
    step?: 'overview' | 'theory' | 'practice' | 'challenge',
    conceptId?: string,
    taskId?: string
  ) => void;
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

export const RoadmapStageBlock: React.FC<RoadmapStageBlockProps> = ({
  milestone,
  modules,
  allModules,
  progress,
  selectedDayId,
  onSelectDayId,
  onStartLearning
}) => {
  // Does this stage contain the currently selected day?
  const isSelectedInThisStage = milestone.moduleIds.includes(selectedDayId);

  // Selected module in this stage, or fallback to first module
  const selectedModule = modules.find(m => m.id === selectedDayId) || modules[0];
  const dayProgress = selectedModule ? calculateDayProgress(progress, selectedModule) : { percentage: 0, isCompleted: false };

  // Calculate stage progress
  const stageCompletedDays = modules.filter(m => isDayCompleted(progress, m.id)).length;
  const isStageCompleted = modules.length > 0 && stageCompletedDays === modules.length;
  const isStageActive = isSelectedInThisStage || (stageCompletedDays > 0 && !isStageCompleted);
  const stagePercentage = modules.length > 0
    ? Math.round((stageCompletedDays / modules.length) * 100)
    : 0;

  // Caret positioning
  const trackRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  const updateCaretPosition = useCallback(() => {
    if (!isSelectedInThisStage) return;
    const btn = buttonRefs.current[selectedDayId];
    const box = boxRef.current;
    if (btn && box) {
      const btnRect = btn.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const relativeX = btnRect.left + btnRect.width / 2 - boxRect.left;
      const clamped = Math.max(32, Math.min(boxRect.width - 32, relativeX));
      setCaretLeft(clamped);
    }
  }, [selectedDayId, isSelectedInThisStage]);

  useEffect(() => {
    if (!isSelectedInThisStage) return;
    updateCaretPosition();
    const box = boxRef.current;
    let ro: ResizeObserver | null = null;
    if (box && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateCaretPosition();
      });
      ro.observe(box);
    }

    const timer = setTimeout(updateCaretPosition, 100);
    window.addEventListener('resize', updateCaretPosition);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateCaretPosition);
    };
  }, [updateCaretPosition, isSelectedInThisStage]);

  // Clean title for display
  const cleanTitle = selectedModule
    ? (selectedModule.shortTitle || selectedModule.title).replace(/^Day\s+\d+\s*[-—:]\s*/i, '')
    : '';

  // Helper to keep card sentences clear, punchy, and concise
  const formatConciseCardText = (title?: string, description?: string): string => {
    let text = (title || description || '').trim();
    text = text.replace(/^(Task\s+\d+|Query|Concept\s+\d+|Step\s+\d+|Prisma)[\s:–—-]+/i, '').trim();
    if (text.length > 55) {
      const firstSentence = text.split(/[.!?]/)[0].trim();
      if (firstSentence.length >= 8 && firstSentence.length <= 55) {
        return firstSentence;
      }
      return text.substring(0, 52).trim() + '...';
    }
    return text;
  };

  // Extract up to 4 core items from concepts/tasks
  const allTasks = selectedModule ? selectedModule.concepts.flatMap(c =>
    c.tasks.map(t => ({
      ...t,
      conceptId: c.id
    }))
  ) : [];

  const firstUncompletedIndex = allTasks.findIndex(t => !progress.completedTaskIds.includes(t.id));
  const displayTasks = allTasks.slice(0, 4);
  const cardItems: CardItem[] = displayTasks.map((t, idx) => ({
    id: t.id,
    number: idx + 1,
    text: formatConciseCardText(t.title, t.description),
    conceptId: t.conceptId,
    taskId: t.id,
    isCompleted: progress.completedTaskIds.includes(t.id),
    isCurrent: idx === (firstUncompletedIndex >= 0 ? firstUncompletedIndex : 0)
  }));

  if (cardItems.length < 4 && selectedModule?.completionLearnings) {
    const needed = 4 - cardItems.length;
    for (let i = 0; i < needed && i < selectedModule.completionLearnings.length; i++) {
      cardItems.push({
        id: `learning-${i}`,
        number: cardItems.length + 1,
        text: formatConciseCardText(selectedModule.completionLearnings[i]),
        conceptId: selectedModule.concepts[0]?.id || '',
        taskId: selectedModule.concepts[0]?.tasks[0]?.id || '',
        isCompleted: dayProgress.isCompleted,
        isCurrent: false
      });
    }
  }

  // Challenge progress
  const challengeTasks = selectedModule?.challenge?.tasks || [];
  const challengeCompleted = challengeTasks.length > 0 && challengeTasks.every(t => progress.completedTaskIds.includes(t.id));
  const challengePercentage = challengeCompleted
    ? 100
    : challengeTasks.length > 0
    ? Math.round((challengeTasks.filter(t => progress.completedTaskIds.includes(t.id)).length / challengeTasks.length) * 100)
    : 0;

  // Split modules symmetrically around center spine if 8 or more, or split in half
  const halfPoint = Math.ceil(modules.length / 2);
  const leftModules = modules.slice(0, halfPoint);
  const rightModules = modules.slice(halfPoint);

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* ----------------------------------------------------------------- */}
      {/* STAGE CARD (From Reference Screenshot)                            */}
      {/* ----------------------------------------------------------------- */}
      <div
        className={`relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 text-center transition-all ${
          isStageActive
            ? 'border-2 border-sky-400 bg-[#071322] shadow-[0_0_35px_rgba(56,189,248,0.25)]'
            : isStageCompleted
            ? 'border border-emerald-500/50 bg-[#071520] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
            : 'border border-sky-950/80 bg-[#060D17] opacity-85 hover:border-sky-900/90'
        }`}
      >
        <div className="text-sky-400 font-mono text-xs font-bold tracking-widest uppercase">
          STAGE {milestone.number} · {isStageCompleted ? 'COMPLETED' : isStageActive ? 'ACTIVE' : 'UPCOMING'}
        </div>
        <h2 className="font-mono font-bold text-white text-base sm:text-lg mt-2 leading-snug">
          {milestone.title}
        </h2>
        <div className="text-slate-400 font-mono text-xs mt-1.5">
          {milestone.daysRange}
        </div>
        <div className="border-t border-sky-950/80 my-3.5" />
        <div className="text-slate-300 font-mono text-xs font-medium">
          {stagePercentage}% complete
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* VERTICAL STEM: From Stage Card to Day Nodes                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 w-[2px] h-10 sm:h-12 bg-sky-900/60" />

      {/* ----------------------------------------------------------------- */}
      {/* DAY NODES: Symmetrical layout with central spine divider          */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={trackRef}
        className="relative z-10 w-full overflow-x-auto no-scrollbar py-2 px-2 sm:px-4 flex items-center justify-center gap-2 sm:gap-3"
      >
        {/* Left Half of Days */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {leftModules.map(mod => {
            const isSelected = mod.id === selectedDayId;
            const completed = isDayCompleted(progress, mod.id);
            const unlocked = isDayUnlocked(progress, mod.id, allModules);
            const resumeTarget = resolveDayResumeTarget(mod, progress);

            return (
              <button
                key={mod.id}
                ref={el => { buttonRefs.current[mod.id] = el; }}
                onClick={() => {
                  if (unlocked) {
                    onSelectDayId(mod.id);
                    onStartLearning(mod.id, resumeTarget.subStep, resumeTarget.conceptId, resumeTarget.taskId);
                  }
                }}
                disabled={!unlocked}
                title={`Day ${mod.day}: Click to resume (${resumeTarget.label})`}
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
            );
          })}
        </div>

        {/* Central Spine Divider passing between left and right groups */}
        <div className="w-[2px] h-8 sm:h-9 bg-sky-900/60 my-auto mx-1 sm:mx-2 shrink-0" />

        {/* Right Half of Days */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {rightModules.map(mod => {
            const isSelected = mod.id === selectedDayId;
            const completed = isDayCompleted(progress, mod.id);
            const unlocked = isDayUnlocked(progress, mod.id, allModules);
            const resumeTarget = resolveDayResumeTarget(mod, progress);

            return (
              <button
                key={mod.id}
                ref={el => { buttonRefs.current[mod.id] = el; }}
                onClick={() => {
                  if (unlocked) {
                    onSelectDayId(mod.id);
                    onStartLearning(mod.id, resumeTarget.subStep, resumeTarget.conceptId, resumeTarget.taskId);
                  }
                }}
                disabled={!unlocked}
                title={`Day ${mod.day}: Click to resume (${resumeTarget.label})`}
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
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* THE BOX: Appears only if this stage contains the selected day     */}
      {/* ----------------------------------------------------------------- */}
      {isSelectedInThisStage && selectedModule && (
        <div
          ref={boxRef}
          className="relative z-10 w-full mt-4 rounded-2xl border border-sky-500/30 bg-[#081220]/95 backdrop-blur-md p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_-5px_rgba(14,165,233,0.12)] transition-all"
        >
          {/* Pointer Caret pointing up directly to active day circle */}
          {caretLeft !== null && (
            <div
              className="absolute -top-2 w-4 h-4 bg-[#081220] border-t border-l border-sky-500/30 rotate-45 z-20 pointer-events-none transition-all duration-300 ease-out"
              style={{ left: `${caretLeft}px`, transform: 'translateX(-50%) rotate(45deg)' }}
            />
          )}

          {/* Box Header: "Day X – Title" on Left, "0% done" on Right */}
          <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <h3
                onClick={() => onStartLearning(selectedModule.id, 'theory')}
                className="font-mono font-bold text-sm sm:text-base md:text-lg text-white tracking-wide truncate cursor-pointer hover:text-sky-300 transition-colors"
                title="Start Day Theory"
              >
                Day {selectedModule.day} – {cleanTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono font-semibold text-xs sm:text-sm text-sky-400">
                {dayProgress.percentage}% done
              </span>
            </div>
          </div>

          {/* Resume Where You Left Off Banner CTA */}
          {selectedModule && (
            <div className="mb-4 sm:mb-5">
              <button
                onClick={() => {
                  const target = resolveDayResumeTarget(selectedModule, progress);
                  onStartLearning(
                    selectedModule.id,
                    target.subStep,
                    target.conceptId,
                    target.taskId
                  );
                }}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-sky-500/15 via-sky-500/10 to-[#081528] border border-sky-500/30 hover:border-sky-400 hover:from-sky-500/25 transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-3 text-left min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-sky-400/20 group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider">
                      Resume Where You Left Off
                    </div>
                    <div className="text-xs sm:text-sm text-white font-medium truncate">
                      {resolveDayResumeTarget(selectedModule, progress).label}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 font-mono text-xs text-sky-300 group-hover:text-white shrink-0 pl-3">
                  <span className="hidden sm:inline">Continue</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          )}

          {/* 2x2 Concept / Task Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {cardItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onStartLearning(selectedModule.id, 'theory', item.conceptId, item.taskId)}
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
                  <p className="font-sans text-xs sm:text-[13px] text-slate-200 group-hover:text-white leading-relaxed transition-colors">
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
      )}
    </div>
  );
};
