import React, { useState } from 'react';
import { TargetHeroCode } from '../../types/curriculum';
import { Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface TargetHeroBannerProps {
  hero: TargetHeroCode;
}

export const TargetHeroBanner: React.FC<TargetHeroBannerProps> = ({ hero }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hero.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl border border-indigo-500/30 bg-gradient-to-b from-[#161D31] to-[#111827] p-4 shadow-xl mb-6 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{hero.badge || 'Target Pattern We Will Dissect'}</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {hero.language.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition border border-slate-700/60 cursor-pointer"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Block */}
      <div className="rounded-lg bg-[#0B0F19] border border-slate-800 p-3.5 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
        <pre className="whitespace-pre">
          {hero.code}
        </pre>
      </div>

      {/* Explanation Footer */}
      <div className="mt-2.5 flex items-start space-x-2 text-xs text-slate-300">
        <Terminal className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
        <p className="leading-normal">{hero.explanation}</p>
      </div>
    </div>
  );
};
