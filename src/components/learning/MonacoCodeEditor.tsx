import React, { useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';

interface CodeEditorProps {
  value?: string;
  code?: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  language?: 'typescript' | 'prisma';
  isExecuting?: boolean;
  disabled?: boolean;
  hideHeader?: boolean;
}

export const MonacoCodeEditor: React.FC<CodeEditorProps> = ({
  value,
  code,
  onChange,
  onRun,
  onReset,
  language = 'typescript',
  isExecuting = false,
  disabled = false,
  hideHeader = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = React.useState(false);

  const currentVal = value ?? code ?? '';

  // Handle Tab key for 2-space indentation and Cmd/Ctrl + Enter for execution
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const updated = currentVal.substring(0, start) + '  ' + currentVal.substring(end);
      onChange(updated);

      setTimeout(() => {
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = Math.max((currentVal || '').split('\n').length, 12);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-[#0B0F19] overflow-hidden shadow-2xl">
      {/* Editor Header Bar (optional) */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-[#111827]/90">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5 mr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono font-medium text-slate-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>{language === 'prisma' ? 'schema.prisma' : 'query.ts'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {language}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onReset && (
              <button
                onClick={onReset}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Reset to Initial Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {onRun && (
              <button
                onClick={onRun}
                disabled={isExecuting || disabled}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition shadow-md shadow-indigo-600/30 cursor-pointer"
                title="Run Query (Ctrl + Enter)"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
                <span className="hidden sm:inline-block text-[10px] bg-indigo-700/60 px-1 py-0.2 rounded font-mono text-indigo-200">
                  ⌘↵
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Editor Body with Line Numbers */}
      <div className="flex flex-1 min-h-[260px] overflow-hidden relative font-mono text-xs leading-relaxed">
        {/* Line Numbers Column */}
        <div className="select-none py-3 px-2.5 bg-[#080C14] border-r border-slate-800/80 text-right text-slate-600 text-[11px] font-mono shrink-0">
          {lineNumbers.map((n) => (
            <div key={n} className="h-5 leading-5">
              {n}
            </div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          value={currentVal}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="w-full h-full p-3 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none resize-none font-mono text-xs leading-5 selection:bg-indigo-900/60 selection:text-white"
        />
      </div>

      {/* Footer Info bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-800/80 bg-[#080C14] text-[11px] text-slate-500 font-mono">
        <div className="flex items-center space-x-3">
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <span>Prisma v7 Client Simulation</span>
        </div>
        <div>
          <span>Press ⌘+Enter to Run</span>
        </div>
      </div>
    </div>
  );
};
