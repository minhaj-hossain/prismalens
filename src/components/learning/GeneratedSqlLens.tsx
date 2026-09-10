import React, { useState } from 'react';
import { GeneratedSqlResult } from '../../types/curriculum';
import {
  Terminal,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Zap,
  Info
} from 'lucide-react';

interface GeneratedSqlLensProps {
  sqlResult?: GeneratedSqlResult;
}

export const GeneratedSqlLens: React.FC<GeneratedSqlLensProps> = ({ sqlResult }) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!sqlResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
        <Terminal className="w-8 h-8 text-slate-600 mb-2 opacity-60" />
        <p>Run a Prisma query to inspect the generated SQL Lens output.</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlResult.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isIndexScan = sqlResult.executionPlan?.includes('Index Scan') || sqlResult.executionPlan?.includes('Index Only');

  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto font-mono text-xs">
      {/* Header with Timing & Index Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prisma Query Engine</span>
          </span>

          <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{sqlResult.durationMs.toFixed(2)} ms</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
            isIndexScan
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <Search className="w-3 h-3" />
            <span>{isIndexScan ? 'Optimal Index Scan' : 'Sequential Table Scan'}</span>
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
        </div>
      </div>

      {/* N+1 Query Warning Banner */}
      {sqlResult.isNPlusOneWarning && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>N+1 Query Pattern Alert!</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            {sqlResult.nPlusOneExplanation ||
              'Sequential loop queries detected. Use include or relation batching to fetch relational data in one or two queries instead of N queries.'}
          </p>
        </div>
      )}

      {/* Raw SQL Output Block */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>PostgreSQL Translated Query</span>
          <span className="text-slate-500 font-normal lowercase text-[10px]">parameterized</span>
        </div>
        <div className="rounded-lg bg-[#080C14] border border-slate-800 p-3.5 overflow-x-auto text-slate-200 text-xs leading-relaxed">
          <pre className="whitespace-pre font-mono">{sqlResult.sql}</pre>
        </div>
      </div>

      {/* Query Parameters */}
      {sqlResult.parameters && sqlResult.parameters.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Query Bind Parameters ($1, $2...)
          </div>
          <div className="rounded-lg bg-[#080C14] border border-slate-800 p-2.5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800/80">
                  <th className="pb-1 w-16">Param</th>
                  <th className="pb-1 w-24">Type</th>
                  <th className="pb-1">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {sqlResult.parameters.map((param, i) => (
                  <tr key={i} className="text-slate-300">
                    <td className="py-1 font-semibold text-indigo-400">${i + 1}</td>
                    <td className="py-1 text-slate-400">{typeof param}</td>
                    <td className="py-1 font-mono text-emerald-300">{JSON.stringify(param)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Execution Plan Analyzer */}
      {sqlResult.executionPlan && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            PostgreSQL EXPLAIN ANALYZE Plan
          </div>
          <div className="rounded-lg bg-[#080C14] border border-slate-800 p-3 overflow-x-auto text-slate-400 text-[11px] leading-relaxed">
            <pre className="whitespace-pre font-mono">{sqlResult.executionPlan}</pre>
          </div>
        </div>
      )}

      {/* SQL Insights Callout */}
      <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 text-slate-300 space-y-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300">
          <Info className="w-3.5 h-3.5" />
          <span>Prisma Query Translation Insight</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Prisma never runs arbitrary untyped queries. It translates client method calls into clean, parameterized SQL with automated connection pooling and prepared statements.
        </p>
      </div>
    </div>
  );
};
