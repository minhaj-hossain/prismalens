import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, Database, Code2, Eye } from 'lucide-react';

interface QueryLensProps {
  conceptId?: string;
  defaultModel?: string;
}

export const QueryLensVisualizer: React.FC<QueryLensProps> = ({
  conceptId,
  defaultModel = 'Student'
}) => {
  // Interactive mode toggle
  const [activeFilter, setActiveFilter] = useState<'all' | 'filtered' | 'selected'>('selected');

  // Interactive variations
  const variants = {
    all: {
      title: 'Full Row Fetch (Default findMany)',
      description: 'Fetches every column from the table. TypeScript infers all properties.',
      prismaCode: `await prisma.student.findMany()`,
      sql: `SELECT "id", "name", "age", "department", "city"\nFROM "students";`,
      highlightCols: ['id', 'name', 'age', 'department', 'city'],
      rows: [
        { id: 1, name: 'Rahim', age: 21, department: 'CSE', city: 'Dhaka' },
        { id: 2, name: 'Karim', age: 22, department: 'EEE', city: 'Gazipur' },
        { id: 3, name: 'Ayesha', age: 20, department: 'CSE', city: 'Dhaka' },
        { id: 4, name: 'Sumaiya', age: 23, department: 'BBA', city: 'Chattogram' },
        { id: 5, name: 'Tanvir', age: 21, department: 'CSE', city: 'Rajshahi' }
      ],
      typeInferred: `Array<{\n  id: number;\n  name: string;\n  age: number;\n  department: string;\n  city: string;\n}>`
    },
    selected: {
      title: 'Shaped Projection (select: { name: true })',
      description: 'Only retrieves the specified column. Database bandwidth is minimized and TypeScript types only the requested column.',
      prismaCode: `await prisma.student.findMany({\n  select: {\n    name: true\n  }\n})`,
      sql: `SELECT "name"\nFROM "students";`,
      highlightCols: ['name'],
      rows: [
        { id: 1, name: 'Rahim', age: 21, department: 'CSE', city: 'Dhaka' },
        { id: 2, name: 'Karim', age: 22, department: 'EEE', city: 'Gazipur' },
        { id: 3, name: 'Ayesha', age: 20, department: 'CSE', city: 'Dhaka' },
        { id: 4, name: 'Sumaiya', age: 23, department: 'BBA', city: 'Chattogram' },
        { id: 5, name: 'Tanvir', age: 21, department: 'CSE', city: 'Rajshahi' }
      ],
      typeInferred: `Array<{\n  name: string;\n}>`
    },
    filtered: {
      title: 'Where Filter + Select (department: "CSE")',
      description: 'Filters rows on PostgreSQL using an index/scan and shapes the returned columns.',
      prismaCode: `await prisma.student.findMany({\n  where: {\n    department: "CSE"\n  },\n  select: {\n    id: true,\n    name: true\n  }\n})`,
      sql: `SELECT "id", "name"\nFROM "students"\nWHERE "department" = 'CSE';`,
      highlightCols: ['id', 'name'],
      rows: [
        { id: 1, name: 'Rahim', age: 21, department: 'CSE', city: 'Dhaka' },
        { id: 3, name: 'Ayesha', age: 20, department: 'CSE', city: 'Dhaka' },
        { id: 5, name: 'Tanvir', age: 21, department: 'CSE', city: 'Rajshahi' }
      ],
      typeInferred: `Array<{\n  id: number;\n  name: string;\n}>`
    }
  };

  const current = variants[activeFilter];

  return (
    <div className="rounded-2xl border border-sky-950 bg-[#060D1A] overflow-hidden my-6 shadow-2xl">
      {/* Visualizer Top Bar with Interactive Mode Tabs */}
      <div className="px-4 py-3 bg-[#081324] border-b border-sky-950 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white tracking-wide">Interactive Query Lens</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">— See what Prisma does under the hood</span>
        </div>

        {/* Variations Selector */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveFilter('selected')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              activeFilter === 'selected'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shape with select
          </button>
          <button
            onClick={() => setActiveFilter('filtered')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              activeFilter === 'filtered'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Filter with where
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-xs ${
              activeFilter === 'all'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Default findMany
          </button>
        </div>
      </div>

      {/* Description Header */}
      <div className="px-5 py-3 bg-[#050B16] border-b border-sky-950/60 text-xs font-sans text-slate-300">
        <strong className="text-white font-mono">{current.title}:</strong> {current.description}
      </div>

      {/* 3-Way Reactive Lens: Prisma Query -> Compiled SQL -> Database Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-sky-950/80 bg-[#040812]">
        {/* Pane 1: Prisma TypeScript Query */}
        <div className="p-4 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5 text-sky-400">
                <Code2 className="w-3.5 h-3.5" />
                <span>1. You Write in TypeScript</span>
              </span>
              <span className="text-[10px] text-slate-500">app.ts</span>
            </div>
            <pre className="p-3 rounded-xl bg-[#02050B] border border-sky-950 text-sky-200 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
              {current.prismaCode}
            </pre>
          </div>

          <div className="pt-2 border-t border-sky-950/60 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Inferred Return Type:</span>
            <pre className="text-emerald-300 text-[11px] leading-tight mt-1 overflow-x-auto">
              {current.typeInferred}
            </pre>
          </div>
        </div>

        {/* Pane 2: Live Compiled SQL */}
        <div className="p-4 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Prisma Engine Generates</span>
              </span>
              <span className="text-[10px] text-slate-500">PostgreSQL</span>
            </div>
            <pre className="p-3 rounded-xl bg-[#02050B] border border-sky-950 text-amber-200 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
              {current.sql}
            </pre>
          </div>

          <div className="pt-2 border-t border-sky-950/60 text-xs font-sans text-slate-400 leading-relaxed">
            Notice how Prisma generates clean, parameterized SQL without SQL injection risk. Only requested columns are fetched across the wire.
          </div>
        </div>

        {/* Pane 3: Database Rows Result */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              <span>3. Returned Data Payload</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">{current.rows.length} rows</span>
          </div>

          <div className="rounded-xl border border-sky-950 bg-[#02050B] overflow-hidden">
            <div className="overflow-x-auto max-h-[190px]">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-sky-950 bg-[#081324] text-slate-400">
                    <th className="p-2">name</th>
                    {activeFilter !== 'selected' && <th className="p-2">department</th>}
                    {activeFilter === 'all' && <th className="p-2">city</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-950/60">
                  {current.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-sky-950/20">
                      <td className="p-2 text-sky-200 font-bold">{r.name}</td>
                      {activeFilter !== 'selected' && (
                        <td className="p-2 text-slate-300">{r.department}</td>
                      )}
                      {activeFilter === 'all' && (
                        <td className="p-2 text-slate-400">{r.city}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
