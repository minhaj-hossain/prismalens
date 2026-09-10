import React, { useState } from 'react';
import { Copy, Check, FileCode, Sparkles, ShieldCheck } from 'lucide-react';

interface TypeInspectorProps {
  inferredType?: string;
  modelName?: string;
  hasSelectPruning?: boolean;
}

export const TypeInspector: React.FC<TypeInspectorProps> = ({
  inferredType,
  modelName = 'User',
  hasSelectPruning = false
}) => {
  const [copied, setCopied] = useState(false);

  if (!inferredType) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
        <FileCode className="w-8 h-8 text-slate-600 mb-2 opacity-60" />
        <p>Run a Prisma query to inspect the inferred TypeScript return type.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inferredType);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Inferred TypeScript Type</span>
          </span>

          {hasSelectPruning && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Scalar Pruning Applied</span>
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy Type'}</span>
        </button>
      </div>

      {/* Code Block */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Prisma.GetPayload&lt;...&gt;</span>
          <span className="text-slate-500 text-[10px] lowercase">static inference</span>
        </div>
        <div className="rounded-lg bg-[#080C14] border border-slate-800 p-3.5 overflow-x-auto text-slate-200 text-xs leading-relaxed">
          <pre className="whitespace-pre font-mono">{inferredType}</pre>
        </div>
      </div>

      {/* Why This Matters Callout */}
      <div className="rounded-lg bg-blue-950/20 border border-blue-500/20 p-3 text-slate-300 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-300">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Why Type Safety Matters</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Unlike other ORMs where queries return generic dictionaries or manual types, Prisma generates types directly matching your query. If you only select <code className="text-indigo-300 font-mono">email</code> and <code className="text-indigo-300 font-mono">name</code>, TypeScript forbids accessing unselected fields like <code className="text-slate-400 font-mono">passwordHash</code>.
        </p>
      </div>
    </div>
  );
};
