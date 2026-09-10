import React, { useState } from 'react';
import { Layers, Database, Code2, Check, ShieldCheck, Key, Hash } from 'lucide-react';

export const SchemaBlueprintVisualizer: React.FC = () => {
  const [activeToken, setActiveToken] = useState<'id' | 'unique' | 'optional' | 'enum' | 'index'>('id');

  const tokens = {
    id: {
      label: '@id @default(autoincrement())',
      title: 'Primary Key & Identity Generation',
      sqlEquivalent: 'id SERIAL PRIMARY KEY',
      rule: 'Guarantees uniqueness and immutability for every record. Prisma generates auto-incrementing integer sequence.',
      tsType: 'number',
      dbImpact: 'Creates a clustered B-tree primary key index on PostgreSQL with NOT NULL constraint.'
    },
    unique: {
      label: '@unique',
      title: 'Unique Index Constraint',
      sqlEquivalent: 'CREATE UNIQUE INDEX users_email_key ON users(email);',
      rule: 'Ensures no two rows share the same value. Violations throw Prisma error P2002.',
      tsType: 'string (guaranteed unique)',
      dbImpact: 'PostgreSQL builds a unique index. Used automatically by Prisma as a valid criteria for findUnique.'
    },
    optional: {
      label: 'String? (Nullability)',
      title: 'Optional vs Required Fields',
      sqlEquivalent: 'avatar_url VARCHAR(255) NULL (default is NOT NULL)',
      rule: 'Appending ? marks a column as nullable. In TypeScript, the type becomes string | null.',
      tsType: 'string | null',
      dbImpact: 'Omits the NOT NULL constraint in SQL schema migrations.'
    },
    enum: {
      label: 'enum Role',
      title: 'PostgreSQL Native Enums',
      sqlEquivalent: `CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SELLER');`,
      rule: 'Restricts values to a finite compile-time set. Prevents arbitrary string typos.',
      tsType: `'USER' | 'ADMIN' | 'SELLER'`,
      dbImpact: 'Stored efficiently as a 4-byte internal enum type rather than an unbounded text column.'
    },
    index: {
      label: '@@index([department, city])',
      title: 'Composite Query Index',
      sqlEquivalent: 'CREATE INDEX idx_students_dept_city ON students(department, city);',
      rule: 'Optimizes multi-column filtering queries like findMany({ where: { department, city } }).',
      tsType: 'N/A (Performance construct)',
      dbImpact: 'Turns costly O(N) sequential table scans into O(log N) index lookups on PostgreSQL.'
    }
  };

  const current = tokens[activeToken];

  return (
    <div className="rounded-2xl border border-sky-950 bg-[#060D1A] overflow-hidden my-6 shadow-2xl font-sans">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#081324] border-b border-sky-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white tracking-wide">Interactive Schema Blueprint</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">— Click any schema attribute to inspect database behavior</span>
        </div>

        {/* Attribute Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(tokens) as Array<keyof typeof tokens>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveToken(key)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                activeToken === key
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tokens[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: schema.prisma Code on left, Database Constraint Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-sky-950/80 bg-[#030711]">
        {/* Left: Annotated schema.prisma file */}
        <div className="p-5 font-mono text-xs space-y-3">
          <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>schema.prisma</span>
            </span>
            <span className="text-slate-500 text-[10px]">Source of Truth</span>
          </div>

          <div className="p-4 rounded-xl bg-[#02050B] border border-sky-950 leading-relaxed text-slate-300 space-y-1">
            <div className="text-slate-500">// User model definition</div>
            <div>
              <span className="text-purple-400 font-bold">model</span>{' '}
              <span className="text-yellow-300 font-bold">User</span> &#123;
            </div>
            <div className="pl-4 flex items-center justify-between group">
              <span>
                id <span className="text-sky-300">Int</span>
              </span>
              <button
                onClick={() => setActiveToken('id')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  activeToken === 'id'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                @id @default(autoincrement())
              </button>
            </div>
            <div className="pl-4 flex items-center justify-between group">
              <span>
                email <span className="text-sky-300">String</span>
              </span>
              <button
                onClick={() => setActiveToken('unique')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  activeToken === 'unique'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                @unique
              </button>
            </div>
            <div className="pl-4 flex items-center justify-between group">
              <span>
                avatarUrl <span className="text-amber-300">String?</span>
              </span>
              <button
                onClick={() => setActiveToken('optional')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  activeToken === 'optional'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Optional (?)
              </button>
            </div>
            <div className="pl-4 flex items-center justify-between group">
              <span>
                role <span className="text-emerald-300">Role</span>
              </span>
              <button
                onClick={() => setActiveToken('enum')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  activeToken === 'enum'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                @default(USER)
              </button>
            </div>
            <div className="pl-4 pt-2">
              <button
                onClick={() => setActiveToken('index')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                  activeToken === 'index'
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                @@index([department, city])
              </button>
            </div>
            <div>&#125;</div>
          </div>
        </div>

        {/* Right: Underlying Database Constraint & TypeScript Type */}
        <div className="p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-white">{current.title}</span>
            </div>

            {/* SQL DDL Equivalent Box */}
            <div className="p-3 rounded-xl bg-[#02050B] border border-sky-950 font-mono text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Compiled SQL DDL:</span>
              <pre className="text-amber-300 whitespace-pre overflow-x-auto leading-relaxed">
                {current.sqlEquivalent}
              </pre>
            </div>

            {/* Rule & DB Impact */}
            <div className="space-y-2 text-xs text-slate-300 font-sans leading-relaxed">
              <p>
                <strong className="text-white">Rule:</strong> {current.rule}
              </p>
              <p>
                <strong className="text-white">Database Impact:</strong> {current.dbImpact}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#071324] border border-sky-950/80 font-mono text-xs flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">TypeScript Inferred Type:</span>
            <span className="text-sky-300 font-bold">{current.tsType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
