import React, { useState } from 'react';
import {
  Layers,
  Check,
  ChevronRight,
  ChevronDown,
  Filter,
  Eye,
  Database,
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface InteractiveConceptVisualProps {
  conceptId: string;
  conceptTitle: string;
}

export const InteractiveConceptVisual: React.FC<InteractiveConceptVisualProps> = ({
  conceptId,
  conceptTitle
}) => {
  // Determine widget type based on concept ID
  const isRelationConcept =
    conceptId.includes('relation') ||
    conceptId.includes('foreign') ||
    conceptId.includes('include') ||
    conceptId.includes('join');

  const isFilterConcept =
    conceptId.includes('filter') ||
    conceptId.includes('where') ||
    conceptId.includes('operator');

  const isSelectConcept =
    conceptId.includes('select') ||
    conceptId.includes('field') ||
    conceptId.includes('column');

  const isSchemaConcept =
    conceptId.includes('schema') ||
    conceptId.includes('model') ||
    conceptId.includes('type') ||
    conceptId.includes('enum') ||
    conceptId.includes('attribute');

  // Widget 1: Relations & Hydration Explorer State
  const [includeOrders, setIncludeOrders] = useState(false);
  const [includeProfile, setIncludeProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(1);

  // Widget 2: Filter Explorer State
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [minTotal, setMinTotal] = useState<number>(0);

  // Widget 3: Select Explorer State
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    id: true,
    email: true,
    name: true,
    role: false,
    createdAt: false
  });

  // Widget 4: Schema Inspector State
  const [activeSchemaField, setActiveSchemaField] = useState<string>('email');

  // Demo database fixture
  const sampleUsers = [
    {
      id: 1,
      name: 'Minhaj',
      email: 'minhaj@example.com',
      role: 'ADMIN',
      profile: { bio: 'Database Enthusiast', website: 'https://minhaj.dev' },
      orders: [
        { id: 101, total: 84.0, status: 'DELIVERED', date: '2026-03-01' },
        { id: 102, total: 12.5, status: 'PROCESSING', date: '2026-03-03' },
        { id: 103, total: 199.0, status: 'DELIVERED', date: '2026-03-05' }
      ]
    },
    {
      id: 2,
      name: 'Sara',
      email: 'sara@example.com',
      role: 'CUSTOMER',
      profile: { bio: 'Product Designer', website: 'https://sara.design' },
      orders: [{ id: 104, total: 45.0, status: 'PENDING', date: '2026-03-04' }]
    }
  ];

  // 1. RELATION & HYDRATION EXPLORER
  if (isRelationConcept) {
    const activeUser = sampleUsers.find((u) => u.id === selectedUserId) || sampleUsers[0];

    return (
      <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden my-6">
        {/* Widget Header */}
        <div className="px-4 py-3 bg-[#131D31] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-xs text-white">
              Interactive Relation Explorer: 1-to-Many Hydration
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Click user or toggle `include`
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800/80">
            <span className="text-xs text-slate-400 mr-1">Prisma Query Options:</span>
            <button
              onClick={() => setIncludeOrders(!includeOrders)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                includeOrders
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span>include: &#123; orders: {includeOrders ? 'true' : 'false'} &#125;</span>
              {includeOrders && <Check className="w-3 h-3 text-white" />}
            </button>

            <button
              onClick={() => setIncludeProfile(!includeProfile)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                includeProfile
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm shadow-cyan-600/30 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span>include: &#123; profile: {includeProfile ? 'true' : 'false'} &#125;</span>
              {includeProfile && <Check className="w-3 h-3 text-white" />}
            </button>
          </div>

          {/* Visualization Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Parent Node */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                1. User Record (Parent Table)
              </div>
              <div className="space-y-2">
                {sampleUsers.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-indigo-300">
                            id: {u.id}
                          </span>
                          <span className="font-semibold text-white">{u.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hydrated Related Records */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>2. Hydrated Relations</span>
                {includeOrders || includeProfile ? (
                  <span className="text-emerald-400 text-[10px] font-semibold">● Hydrated via Prisma</span>
                ) : (
                  <span className="text-amber-400 text-[10px]">○ Not included in query</span>
                )}
              </div>

              {!includeOrders && !includeProfile ? (
                <div className="p-5 rounded-lg border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    Relations are <strong className="text-slate-200">not loaded by default</strong> in Prisma.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Toggle <code className="text-indigo-300">include: &#123; orders: true &#125;</code> above to see how Prisma hydrates child orders!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {includeOrders && (
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                      <div className="text-[11px] font-semibold text-indigo-300 flex items-center justify-between">
                        <span>Orders ({activeUser.orders.length} related records)</span>
                        <span className="text-[10px] font-mono text-slate-400">FK: userId = {activeUser.id}</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeUser.orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="px-2 py-1.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]"
                          >
                            <span className="font-mono text-slate-300">Order #{ord.id}</span>
                            <span className="font-mono font-semibold text-emerald-400">
                              ${ord.total.toFixed(2)}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                              {ord.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {includeProfile && (
                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-1.5">
                      <div className="text-[11px] font-semibold text-cyan-300">
                        Profile (1:1 Relation)
                      </div>
                      <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                        <div>
                          <span className="text-slate-500">bio:</span>{' '}
                          <span className="text-slate-200">{activeUser.profile.bio}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">website:</span>{' '}
                          <span className="text-indigo-400 underline">{activeUser.profile.website}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Explanation Bar */}
          <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 text-xs flex items-start space-x-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">What happens in the database:</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {includeOrders
                  ? 'Prisma runs the User query, then issues a fast `SELECT ... FROM "Order" WHERE "userId" IN (...)` and stitches the orders directly into your TypeScript user object.'
                  : 'Prisma only executes `SELECT ... FROM "User"`. No JOIN overhead is incurred because related orders were not requested.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. FILTER EXPLORER
  if (isFilterConcept) {
    const orders = [
      { id: 1, user: 'Minhaj', total: 120, status: 'ACTIVE' },
      { id: 2, user: 'Sara', total: 45, status: 'PENDING' },
      { id: 3, user: 'Alex', total: 85, status: 'ACTIVE' },
      { id: 4, user: 'Jordan', total: 15, status: 'PENDING' }
    ];

    const filtered = orders.filter((o) => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (o.total < minTotal) return false;
      return true;
    });

    return (
      <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden my-6">
        <div className="px-4 py-3 bg-[#131D31] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-xs text-white">
              Interactive Filter Simulator: `where` Clause
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {filtered.length} of {orders.length} rows matched
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400">status:</span>
              {(['ALL', 'ACTIVE', 'PENDING'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                    statusFilter === s
                      ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">total &gt;=</span>
              <input
                type="range"
                min="0"
                max="100"
                step="20"
                value={minTotal}
                onChange={(e) => setMinTotal(Number(e.target.value))}
                className="w-24 accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-emerald-400">${minTotal}</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-1.5">
            {filtered.map((ord) => (
              <div
                key={ord.id}
                className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-500">#{ord.id}</span>
                  <span className="font-sans font-semibold text-white">{ord.user}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-emerald-400 font-semibold">${ord.total}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      ord.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Generated SQL preview */}
          <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 text-xs font-mono space-y-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-sans">
              What happens in the database:
            </span>
            <code className="text-emerald-300 text-[11px] block">
              SELECT * FROM "Order"
              {statusFilter !== 'ALL' || minTotal > 0 ? ' WHERE ' : ''}
              {statusFilter !== 'ALL' ? `"status" = '${statusFilter}'` : ''}
              {statusFilter !== 'ALL' && minTotal > 0 ? ' AND ' : ''}
              {minTotal > 0 ? `"total" &gt;= ${minTotal}` : ''};
            </code>
          </div>
        </div>
      </div>
    );
  }

  // 3. SELECT / PROJECTION EXPLORER
  if (isSelectConcept) {
    const fields = ['id', 'email', 'name', 'role', 'createdAt'];
    const activeFieldNames = Object.entries(selectedFields)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    return (
      <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden my-6">
        <div className="px-4 py-3 bg-[#131D31] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-xs text-white">
              Interactive Field Projection: `select` vs Full Fetch
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeFieldNames.length} of {fields.length} columns selected
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs text-slate-400 mr-1">Toggle Columns:</span>
            {fields.map((f) => {
              const active = selectedFields[f];
              return (
                <button
                  key={f}
                  onClick={() =>
                    setSelectedFields((prev) => ({
                      ...prev,
                      [f]: !prev[f]
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer border ${
                    active
                      ? 'bg-cyan-600 text-white border-cyan-500 font-semibold shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {f} {active ? '✓' : ''}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prisma Syntax */}
            <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 space-y-1 font-mono text-xs">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-sans block">
                Prisma Client
              </span>
              <pre className="text-indigo-300 text-[11px] overflow-x-auto">
                {`prisma.user.findMany({\n  select: {\n${activeFieldNames
                  .map((k) => `    ${k}: true`)
                  .join(',\n')}\n  }\n})`}
              </pre>
            </div>

            {/* SQL Output */}
            <div className="p-3 rounded-lg bg-[#0B0F19] border border-slate-800 space-y-1 font-mono text-xs">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-sans block">
                What happens in the database
              </span>
              <pre className="text-cyan-300 text-[11px] overflow-x-auto">
                {`SELECT\n  ${
                  activeFieldNames.length > 0
                    ? activeFieldNames.map((k) => `"${k}"`).join(', ')
                    : '/* no columns */'
                }\nFROM "User";`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. DEFAULT: SCHEMA & CONSTRAINT INSPECTOR
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827] overflow-hidden my-6">
      <div className="px-4 py-3 bg-[#131D31] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-xs text-white">
            Interactive Schema Inspector: Model to SQL Mapping
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Click any field to observe its database constraint
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Model Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-800 bg-[#0B0F19] p-3 space-y-2 font-mono text-xs">
            <span className="text-indigo-400 font-bold font-sans text-xs">model User</span>
            <div className="space-y-1 pl-2 border-l-2 border-indigo-500/30">
              {[
                { name: 'id', type: 'Int', attr: '@id @default(autoincrement())' },
                { name: 'email', type: 'String', attr: '@unique' },
                { name: 'name', type: 'String?', attr: 'optional' },
                { name: 'role', type: 'Role', attr: "@default(USER)" }
              ].map((field) => {
                const isActive = activeSchemaField === field.name;
                return (
                  <button
                    key={field.name}
                    onClick={() => setActiveSchemaField(field.name)}
                    className={`w-full text-left px-2 py-1.5 rounded transition cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/40'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <span>
                      {field.name} <span className="text-cyan-400">{field.type}</span>
                    </span>
                    <span className="text-slate-500 text-[10px]">{field.attr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Database effect explanation */}
          <div className="rounded-lg border border-slate-800 bg-[#0B0F19] p-3 space-y-2 text-xs">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-sans block">
              What happens in PostgreSQL:
            </span>
            {activeSchemaField === 'id' && (
              <div className="space-y-1.5">
                <span className="font-bold text-indigo-300 font-mono text-xs">
                  "id" SERIAL PRIMARY KEY
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  PostgreSQL automatically creates an auto-incrementing sequence and attaches a primary key b-tree index.
                </p>
              </div>
            )}
            {activeSchemaField === 'email' && (
              <div className="space-y-1.5">
                <span className="font-bold text-cyan-300 font-mono text-xs">
                  CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Enforces that no two records share the same email. Attempting to insert a duplicate triggers error code <code className="text-rose-400">P2002</code> in Prisma!
                </p>
              </div>
            )}
            {activeSchemaField === 'name' && (
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-300 font-mono text-xs">
                  "name" TEXT NULL
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The <code className="text-emerald-400">?</code> in Prisma maps to a nullable database column and <code className="text-emerald-400">string | null</code> in TypeScript.
                </p>
              </div>
            )}
            {activeSchemaField === 'role' && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-300 font-mono text-xs">
                  "role" "Role" DEFAULT 'USER' NOT NULL
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Prisma binds the column to a PostgreSQL native ENUM type with a fallback default.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
