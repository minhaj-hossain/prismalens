import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2, Clock, ArrowRight, Activity } from 'lucide-react';

export const PerformanceWaterfallVisualizer: React.FC = () => {
  const [approach, setApproach] = useState<'nPlusOne' | 'batched'>('batched');

  return (
    <div className="rounded-2xl border border-sky-950 bg-[#060D1A] overflow-hidden my-6 shadow-2xl font-sans">
      {/* Top Header with Strategy Selector */}
      <div className="px-4 py-3 bg-[#081324] border-b border-sky-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white tracking-wide">Performance & Execution Waterfall</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">— Inspect database query count and latency</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setApproach('batched')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              approach === 'batched'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prisma Batching (2 queries · 12ms)
          </button>
          <button
            onClick={() => setApproach('nPlusOne')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              approach === 'nPlusOne'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            N+1 Anti-Pattern (101 queries · 320ms)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 bg-[#030711] space-y-5">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#060D1A] border border-sky-950 flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Total SQL Queries</span>
            <span
              className={`text-xl font-bold mt-1 ${
                approach === 'batched' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {approach === 'batched' ? '2 queries' : '101 queries'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#060D1A] border border-sky-950 flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Execution Latency</span>
            <span
              className={`text-xl font-bold mt-1 ${
                approach === 'batched' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {approach === 'batched' ? '12 ms' : '324 ms'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#060D1A] border border-sky-950 flex flex-col justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Database Load</span>
            <span
              className={`text-xl font-bold mt-1 ${
                approach === 'batched' ? 'text-sky-300' : 'text-amber-400'
              }`}
            >
              {approach === 'batched' ? 'O(1) Constant' : 'O(N) Connection Spike'}
            </span>
          </div>
        </div>

        {/* Query Execution Breakdown */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
            {approach === 'batched' ? 'Optimized Query Pipeline' : 'The Hidden Query Avalanche'}
          </div>

          {approach === 'batched' ? (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#050C17] border border-emerald-900/60 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <span>Query 1:</span>
                    <span className="text-white">SELECT * FROM "users" LIMIT 100;</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Fetches 100 users in a single roundtrip</div>
                </div>
                <span className="text-emerald-400 font-bold">6ms</span>
              </div>

              <div className="p-3 rounded-xl bg-[#050C17] border border-emerald-900/60 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <span>Query 2:</span>
                    <span className="text-white">SELECT * FROM "posts" WHERE "authorId" IN (1, 2, ..., 100);</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Prisma automatically batches all child relations into a single IN() clause</div>
                </div>
                <span className="text-emerald-400 font-bold">6ms</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#050C17] border border-sky-950 flex items-center justify-between">
                <div className="text-sky-300 font-bold">Query 1: SELECT * FROM "users" LIMIT 100;</div>
                <span className="text-slate-400">6ms</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/50 flex items-center justify-between text-rose-300 text-[11px]">
                <span>Query 2: SELECT * FROM "posts" WHERE "authorId" = 1;</span>
                <span>3ms</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/50 flex items-center justify-between text-rose-300 text-[11px]">
                <span>Query 3: SELECT * FROM "posts" WHERE "authorId" = 2;</span>
                <span>3ms</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/10 border border-rose-950 text-slate-500 text-center text-[10px]">
                ... 98 more individual queries executing in an await loop ...
              </div>
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/50 flex items-center justify-between text-rose-300 text-[11px]">
                <span>Query 101: SELECT * FROM "posts" WHERE "authorId" = 100;</span>
                <span>3ms</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
