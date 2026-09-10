import React, { useState, useRef, useEffect } from 'react';
import { ModuleData } from '../../types/curriculum';
import {
  Layers,
  Zap,
  ChevronDown,
  Database,
  Code2,
  RotateCcw,
  ArrowLeft,
  MoreHorizontal,
  Check
} from 'lucide-react';

interface HeaderProps {
  activeView: 'roadmap' | 'learn' | 'erd' | 'playground';
  daySubStep?: 'theory' | 'practice' | 'challenge' | 'overview';
  currentModule: ModuleData;
  activeConceptTitle?: string;
  activeTaskTitle?: string;
  allModules: ModuleData[];
  onSelectModule: (moduleId: string) => void;
  totalXp: number;
  streakDays?: number;
  onNavigateRoadmap: () => void;
  onTogglePlayground: () => void;
  isPlaygroundActive: boolean;
  onToggleErd: () => void;
  isErdActive: boolean;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  daySubStep,
  currentModule,
  activeConceptTitle,
  activeTaskTitle,
  allModules,
  onSelectModule,
  totalXp,
  onNavigateRoadmap,
  onTogglePlayground,
  isPlaygroundActive,
  onToggleErd,
  isErdActive,
  onResetProgress
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isDayPickerOpen, setIsDayPickerOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const dayPickerRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
      if (dayPickerRef.current && !dayPickerRef.current.contains(e.target as Node)) {
        setIsDayPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-13 border-b border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0 font-sans text-xs">
      {/* Left: Minimal Contextual Breadcrumb */}
      <div className="flex items-center space-x-2 min-w-0">
        {/* Brand Logo */}
        <button
          onClick={onNavigateRoadmap}
          className="flex items-center space-x-2 text-left hover:opacity-90 transition cursor-pointer shrink-0"
          title="PrismaLens Home"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
            PrismaLens
          </span>
        </button>

        <span className="text-slate-600 font-mono text-xs">/</span>

        {/* Dynamic Context Breadcrumb */}
        {activeView === 'roadmap' ? (
          <span className="text-slate-400 font-medium truncate">
            Curriculum Roadmap
          </span>
        ) : (
          <div className="flex items-center space-x-2 min-w-0 font-mono text-xs">
            {/* Day Selector dropdown button */}
            <div className="relative" ref={dayPickerRef}>
              <button
                onClick={() => setIsDayPickerOpen(!isDayPickerOpen)}
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-800/80 text-slate-200 transition cursor-pointer"
              >
                <span className="text-indigo-400 font-semibold">
                  Day {currentModule.day.toString().padStart(2, '0')}
                </span>
                <span className="text-slate-400 hidden md:inline font-sans truncate max-w-[140px]">
                  : {currentModule.shortTitle || currentModule.title}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5 shrink-0" />
              </button>

              {/* Day Picker Dropdown */}
              {isDayPickerOpen && (
                <div className="absolute left-0 mt-1.5 w-64 max-h-80 overflow-y-auto rounded-xl border border-slate-800 bg-[#111827] shadow-2xl p-1 z-50 divide-y divide-slate-800/50">
                  {allModules.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModule(m.id);
                        setIsDayPickerOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition cursor-pointer text-xs ${
                        m.id === currentModule.id
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-slate-500 font-mono mr-1.5">
                          D{m.day.toString().padStart(2, '0')}
                        </span>
                        {m.title}
                      </span>
                      {m.id === currentModule.id && (
                        <Check className="w-3 h-3 text-indigo-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-600">/</span>

            {/* Sub-step context label */}
            {activeView === 'erd' ? (
              <span className="text-indigo-300 font-sans font-medium">Live Schema ERD</span>
            ) : activeView === 'playground' ? (
              <span className="text-purple-300 font-sans font-medium">Sandbox Playground</span>
            ) : daySubStep === 'practice' || daySubStep === 'challenge' ? (
              <span className="text-emerald-300 font-sans font-medium truncate max-w-[180px]">
                {activeTaskTitle || (daySubStep === 'challenge' ? 'Final Challenge' : 'Task Practice')}
              </span>
            ) : (
              <span className="text-indigo-300 font-sans font-medium truncate max-w-[180px]">
                {activeConceptTitle || 'Concept Theory'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Clean Utilities & Exit */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Subtle XP Counter */}
        <div
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-xs font-mono"
          title="Total Experience Points"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400 shrink-0" />
          <span>{totalXp} XP</span>
        </div>

        {/* Tools ⋯ Dropdown */}
        <div className="relative" ref={toolsRef}>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer ${
              isToolsOpen || isErdActive || isPlaygroundActive
                ? 'bg-slate-800 border-indigo-500/40 text-slate-200'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Developer Tools"
          >
            <span className="hidden sm:inline font-sans">Tools</span>
            <MoreHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isToolsOpen && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-800 bg-[#111827] shadow-2xl p-1.5 z-50 divide-y divide-slate-800/60 font-sans text-xs">
              <div className="py-1">
                <button
                  onClick={() => {
                    onToggleErd();
                    setIsToolsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition cursor-pointer ${
                    isErdActive
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Live Schema ERD</span>
                  </div>
                  {isErdActive && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                <button
                  onClick={() => {
                    onTogglePlayground();
                    setIsToolsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition cursor-pointer ${
                    isPlaygroundActive
                      ? 'bg-purple-600/20 text-purple-300 font-medium'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sandbox Query Runner</span>
                  </div>
                  {isPlaygroundActive && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    onResetProgress();
                    setIsToolsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg flex items-center space-x-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Exit / Return to Roadmap button */}
        {activeView !== 'roadmap' && (
          <button
            onClick={onNavigateRoadmap}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition cursor-pointer text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Roadmap</span>
          </button>
        )}
      </div>
    </header>
  );
};
