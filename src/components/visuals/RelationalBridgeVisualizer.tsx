import React, { useState } from 'react';
import { Layers, ArrowRight, Link2, Database, Code2, Check } from 'lucide-react';

export const RelationalBridgeVisualizer: React.FC = () => {
  const [relationMode, setRelationMode] = useState<'include' | 'foreignKey' | 'leanSelect'>('include');

  return (
    <div className="rounded-2xl border border-sky-950 bg-[#060D1A] overflow-hidden my-6 shadow-2xl font-sans">
      {/* Top Bar with Mode Controls */}
      <div className="px-4 py-3 bg-[#081324] border-b border-sky-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Link2 className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white tracking-wide">The Relational Bridge</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">— How Prisma connects foreign keys into TypeScript trees</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setRelationMode('include')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              relationMode === 'include'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            include: &#123; posts: true &#125;
          </button>
          <button
            onClick={() => setRelationMode('leanSelect')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              relationMode === 'leanSelect'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nested select
          </button>
          <button
            onClick={() => setRelationMode('foreignKey')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              relationMode === 'foreignKey'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Foreign Key
          </button>
        </div>
      </div>

      {/* Narrative Header */}
      <div className="px-5 py-3 bg-[#050B16] border-b border-sky-950/60 text-xs text-slate-300">
        {relationMode === 'include' && (
          <p>
            <strong className="text-white font-mono">Eager Relation Hydration:</strong> Prisma queries the <code className="text-sky-300 font-mono">User</code> table and automatically matches corresponding rows from <code className="text-sky-300 font-mono">Post</code> where <code className="text-sky-300 font-mono">authorId === user.id</code>, nesting them as a typed array.
          </p>
        )}
        {relationMode === 'leanSelect' && (
          <p>
            <strong className="text-white font-mono">Lean Relational Projection:</strong> Rather than pulling entire post objects with body text and timestamps, you project only the post <code className="text-sky-300 font-mono">title</code>, reducing network serialization by ~80%.
          </p>
        )}
        {relationMode === 'foreignKey' && (
          <p>
            <strong className="text-white font-mono">Underlying Relational Reality:</strong> In PostgreSQL, the <code className="text-sky-300 font-mono">posts</code> table only stores an integer pointer <code className="text-amber-300 font-mono">authorId: 1</code>. Prisma shields you from manual JOIN boilerplate.
          </p>
        )}
      </div>

      {/* Visual Two-Table Bridge */}
      <div className="p-5 bg-[#030711] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Table 1: Parent Model (User) */}
          <div className="rounded-xl border border-sky-950 bg-[#060D1A] overflow-hidden">
            <div className="px-3.5 py-2 bg-[#081426] border-b border-sky-950 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-sky-300">User (Parent Model)</span>
              <span className="text-[10px] text-slate-500 font-mono">PK: id</span>
            </div>
            <div className="p-3 font-mono text-xs space-y-2">
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/80 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px]">
                    id: 1
                  </span>
                  <span className="font-bold">Alice Jenkins</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">1 Author</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#040914] border border-sky-950/60 text-slate-400 flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[10px]">id: 2</span>
                <span>Bob Smith</span>
                <span className="text-[10px] text-slate-600">0 Posts</span>
              </div>
            </div>
          </div>

          {/* Table 2: Child Model (Post) */}
          <div className="rounded-xl border border-sky-950 bg-[#060D1A] overflow-hidden">
            <div className="px-3.5 py-2 bg-[#081426] border-b border-sky-950 flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-sky-300">Post (Child Model)</span>
              <span className="text-[10px] text-amber-400 font-mono">FK: authorId</span>
            </div>
            <div className="p-3 font-mono text-xs space-y-2">
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/80 flex items-center justify-between text-white">
                <div>
                  <div className="font-bold text-sky-200">Prisma Architecture Guide</div>
                  <div className="text-[10px] text-slate-400 font-mono">id: 101 · authorId: 1</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Matches User #1
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/80 flex items-center justify-between text-white">
                <div>
                  <div className="font-bold text-sky-200">Building Type-Safe APIs</div>
                  <div className="text-[10px] text-slate-400 font-mono">id: 102 · authorId: 1</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Matches User #1
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resulting Hydrated TypeScript Object */}
        <div className="p-4 rounded-xl border border-sky-950 bg-[#040914] font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase font-bold">
            <span className="text-emerald-400 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Hydrated Output (Nested TypeScript Contract)</span>
            </span>
            <span className="text-slate-500 text-[10px]">Zero Manual Joins</span>
          </div>

          <pre className="text-sky-200 bg-[#02050B] p-3.5 rounded-lg border border-sky-950 overflow-x-auto leading-relaxed">
            {relationMode === 'include' &&
`{
  id: 1,
  name: "Alice Jenkins",
  posts: [
    { id: 101, title: "Prisma Architecture Guide", authorId: 1 },
    { id: 102, title: "Building Type-Safe APIs", authorId: 1 }
  ]
}`}
            {relationMode === 'leanSelect' &&
`{
  name: "Alice Jenkins",
  posts: [
    { title: "Prisma Architecture Guide" },
    { title: "Building Type-Safe APIs" }
  ]
}`}
            {relationMode === 'foreignKey' &&
`{
  id: 1,
  name: "Alice Jenkins"
  // Note: posts are not fetched unless you explicitly specify 'include' or 'select'!
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
