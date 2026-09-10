import React, { useState } from 'react';
import { Database, ChevronDown, Check, Code, Layers, Table as TableIcon, ExternalLink } from 'lucide-react';

export interface TableColumnDef {
  name: string;
  type: string;
  isPk?: boolean;
}

export interface TableDefinition {
  id: string;
  name: string;
  badge?: string;
  columns: TableColumnDef[];
  rows: (string | number | boolean | null)[][];
  schemaText: string;
  relationsText?: string;
}

export const PREVIEW_TABLES: Record<string, TableDefinition> = {
  students: {
    id: 'students',
    name: 'students',
    columns: [
      { name: 'id', type: 'number', isPk: true },
      { name: 'name', type: 'string' },
      { name: 'age', type: 'number' },
      { name: 'department', type: 'string' },
      { name: 'city', type: 'string' }
    ],
    rows: [
      [1, 'Rahim', 21, 'CSE', 'Dhaka'],
      [2, 'Karim', 22, 'EEE', 'Gazipur'],
      [3, 'Ayesha', 20, 'CSE', 'Dhaka'],
      [4, 'Sumaiya', 23, 'BBA', 'Chattogram'],
      [5, 'Tanvir', 21, 'CSE', 'Rajshahi']
    ],
    schemaText: `model Student {
  id         Int    @id @default(autoincrement())
  name       String
  age        Int
  department String
  city       String

  @@map("students")
}`,
    relationsText: 'Standalone model (No foreign keys)'
  },
  users: {
    id: 'users',
    name: 'users',
    columns: [
      { name: 'id', type: 'number', isPk: true },
      { name: 'email', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'role', type: 'Role' },
      { name: 'age', type: 'number' },
      { name: 'status', type: 'string' }
    ],
    rows: [
      [1, 'alice@prisma.io', 'Alice Jenkins', 'ADMIN', 29, 'ACTIVE'],
      [2, 'bob@prisma.io', 'Bob Smith', 'USER', 34, 'ACTIVE'],
      [3, 'charlie@prisma.io', 'Charlie Dave', 'USER', 17, 'INACTIVE'],
      [4, 'diana@prisma.io', 'Diana Prince', 'SELLER', 28, 'ACTIVE'],
      [5, 'edward@prisma.io', 'Edward Elric', 'USER', 22, 'ACTIVE']
    ],
    schemaText: `model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  age       Int?
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
  profile   Profile?
  posts     Post[]
  orders    Order[]

  @@map("users")
}`,
    relationsText: 'Has-one: Profile | Has-many: Post, Order'
  },
  posts: {
    id: 'posts',
    name: 'posts',
    columns: [
      { name: 'id', type: 'number', isPk: true },
      { name: 'title', type: 'string' },
      { name: 'published', type: 'boolean' },
      { name: 'views', type: 'number' },
      { name: 'authorId', type: 'number' }
    ],
    rows: [
      [1, 'Prisma v7 Deep Dive: What is New?', true, 1420, 1],
      [2, 'Preventing N+1 Queries with Include', true, 890, 1],
      [3, 'Building Resilient Error Middleware', true, 560, 2],
      [4, 'Draft: Advanced PostgreSQL Constraints', false, 12, 1]
    ],
    schemaText: `model Post {
  id        Int      @id @default(autoincrement())
  title     String
  published Boolean  @default(false)
  views     Int      @default(0)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])

  @@map("posts")
}`,
    relationsText: 'Belongs-to: User (authorId -> User.id)'
  },
  profiles: {
    id: 'profiles',
    name: 'profiles',
    columns: [
      { name: 'id', type: 'number', isPk: true },
      { name: 'bio', type: 'string' },
      { name: 'userId', type: 'number' }
    ],
    rows: [
      [1, 'Full-stack developer and database architect.', 1],
      [2, 'Open source contributor & Prisma enthusiast.', 2],
      [3, 'TypeScript lover & performance tinkerer.', 4]
    ],
    schemaText: `model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  userId Int     @unique
  user   User    @relation(fields: [userId], references: [id])

  @@map("profiles")
}`,
    relationsText: 'Belongs-to: User (userId -> User.id)'
  },
  products: {
    id: 'products',
    name: 'products',
    columns: [
      { name: 'id', type: 'number', isPk: true },
      { name: 'sku', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'price', type: 'Decimal' },
      { name: 'stock', type: 'number' }
    ],
    rows: [
      [101, 'TECH-WIR-001', 'Wireless Ergonomic Keyboard', '129.99', 45],
      [102, 'TECH-MOU-002', 'Precision Wireless Mouse', '69.50', 80],
      [103, 'BOOK-PRISMA-003', 'Production Prisma & TypeScript Guide', '42.00', 120],
      [104, 'APPR-HOOD-004', 'Developer Heavyweight Hoodie', '85.00', 12]
    ],
    schemaText: `model Product {
  id    Int     @id @default(autoincrement())
  sku   String  @unique
  title String
  price Decimal @db.Decimal(10, 2)
  stock Int     @default(100)

  @@map("products")
}`,
    relationsText: 'Has-many: OrderItem | Belongs-to: Category'
  }
};

interface InteractiveTableExplorerProps {
  initialTable?: string;
  highlightedColumns?: string[];
  onSelectTable?: (tableName: string) => void;
}

export const InteractiveTableExplorer: React.FC<InteractiveTableExplorerProps> = ({
  initialTable = 'students',
  highlightedColumns = [],
  onSelectTable
}) => {
  // Normalize table key
  const normalizedInitial = initialTable.toLowerCase().endsWith('s')
    ? initialTable.toLowerCase()
    : `${initialTable.toLowerCase()}s`;

  const availableKeys = Object.keys(PREVIEW_TABLES);
  const matchedKey = availableKeys.includes(normalizedInitial)
    ? normalizedInitial
    : availableKeys.includes(initialTable.toLowerCase())
    ? initialTable.toLowerCase()
    : 'students';

  const [activeTableKey, setActiveTableKey] = useState<string>(matchedKey);
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'er'>('preview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (matchedKey && matchedKey !== activeTableKey) {
      setActiveTableKey(matchedKey);
    }
  }, [matchedKey]);

  const currentTable = PREVIEW_TABLES[activeTableKey] || PREVIEW_TABLES.students;

  const handleTableChange = (key: string) => {
    setActiveTableKey(key);
    setIsDropdownOpen(false);
    onSelectTable?.(key);
  };

  const isColHighlighted = (colName: string) => {
    if (!highlightedColumns || highlightedColumns.length === 0) return false;
    return highlightedColumns.some(
      (h) => h.toLowerCase() === colName.toLowerCase()
    );
  };

  return (
    <div className="rounded-2xl border border-sky-950/80 bg-[#07101E] overflow-hidden flex flex-col h-full shadow-xl">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP HEADER: Table Dropdown Selector, Metadata & View Tabs    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="h-11 px-4 bg-[#081324] border-b border-sky-950/80 flex items-center justify-between shrink-0 font-mono text-xs">
        {/* Left: Table selector with dropdown */}
        <div className="relative flex items-center space-x-3">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#050B15] border border-sky-950 hover:border-sky-800 text-slate-200 font-bold transition cursor-pointer"
          >
            <span className="text-sm">🗄️</span>
            <span className="text-white">{currentTable.name}</span>
            <span className="text-slate-400 text-[11px] font-normal">
              ({currentTable.rows.length} rows)
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Metadata pill */}
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            {currentTable.rows.length} rows · {currentTable.columns.length} cols
          </span>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-10 left-0 z-30 w-52 rounded-xl bg-[#071223] border border-sky-900/80 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Available Tables
                </div>
                {Object.values(PREVIEW_TABLES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTableChange(t.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      t.id === activeTableKey
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                        : 'text-slate-300 hover:bg-sky-950/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>🗄️</span>
                      <span>{t.name}</span>
                    </div>
                    <span className="text-[10px] opacity-70 font-mono">
                      {t.rows.length} rows
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Tabs (Preview, Schema, ER Graph) */}
        <div className="flex items-center h-full space-x-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`h-full flex items-center space-x-1.5 px-3 transition cursor-pointer text-xs ${
              activeTab === 'preview'
                ? 'border-b-2 border-sky-400 text-sky-300 font-bold bg-[#071222]/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`h-full flex items-center space-x-1.5 px-3 transition cursor-pointer text-xs ${
              activeTab === 'schema'
                ? 'border-b-2 border-sky-400 text-sky-300 font-bold bg-[#071222]/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('er')}
            className={`h-full flex items-center space-x-1.5 px-3 transition cursor-pointer text-xs ${
              activeTab === 'er'
                ? 'border-b-2 border-sky-400 text-sky-300 font-bold bg-[#071222]/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ER Graph</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CONTENT AREA                                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto bg-[#050C18] p-3 sm:p-4">
        {/* TAB 1: DATA PREVIEW TABLE */}
        {activeTab === 'preview' && (
          <div className="rounded-xl border border-sky-950/80 bg-[#07101E] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-sky-950/80 bg-[#081324]">
                    {currentTable.columns.map((col, idx) => {
                      const isHighlighted = isColHighlighted(col.name);
                      return (
                        <th
                          key={idx}
                          className={`py-2.5 px-3 sm:px-4 text-xs font-medium tracking-wider select-none transition-colors ${
                            isHighlighted
                              ? 'bg-sky-500/15 text-sky-300 border-b-2 border-sky-400'
                              : 'text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-white">
                              {col.name}
                            </span>
                            {col.isPk && (
                              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 uppercase">
                                PK
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-normal">
                              {col.type}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-950/60">
                  {currentTable.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-sky-950/30 transition-colors"
                    >
                      {row.map((val, cIdx) => {
                        const colName = currentTable.columns[cIdx]?.name;
                        const isHighlighted = colName ? isColHighlighted(colName) : false;
                        return (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-3 sm:px-4 text-xs select-text ${
                              isHighlighted
                                ? 'bg-sky-500/5 text-sky-200 font-semibold'
                                : 'text-slate-300'
                            }`}
                          >
                            {val === null ? (
                              <span className="text-slate-600 italic">null</span>
                            ) : typeof val === 'boolean' ? (
                              <span className={val ? 'text-emerald-400' : 'text-slate-500'}>
                                {String(val)}
                              </span>
                            ) : (
                              <span>{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRISMA SCHEMA DEFINITION */}
        {activeTab === 'schema' && (
          <div className="rounded-xl border border-sky-950/80 bg-[#07101E] p-4 font-mono text-xs overflow-x-auto">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span>schema.prisma model</span>
              <span className="text-sky-400">PostgreSQL</span>
            </div>
            <pre className="text-emerald-300 leading-relaxed whitespace-pre font-mono">
              {currentTable.schemaText}
            </pre>
          </div>
        )}

        {/* TAB 3: ER GRAPH VIEW */}
        {activeTab === 'er' && (
          <div className="rounded-xl border border-sky-950/80 bg-[#07101E] p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                Entity Relations Diagram
              </span>
              <span className="text-xs text-sky-400">
                {currentTable.relationsText}
              </span>
            </div>

            {/* Visual Node Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Active Model Node */}
              <div className="p-3 rounded-xl border border-sky-500/40 bg-[#0A1629] space-y-2">
                <div className="flex items-center justify-between border-b border-sky-900 pb-1.5">
                  <div className="flex items-center space-x-1.5 text-sky-300 font-bold">
                    <span>🗄️</span>
                    <span>{currentTable.name}</span>
                  </div>
                  <span className="text-[10px] text-sky-400">Target</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  {currentTable.columns.map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-300">
                      <span>{c.name}</span>
                      <span className="text-slate-500">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related/Companion Information */}
              <div className="p-3 rounded-xl border border-slate-800 bg-[#060D18] space-y-2">
                <div className="border-b border-slate-800 pb-1.5 text-slate-400 font-bold text-[11px] uppercase">
                  Relationship Cardinality
                </div>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">
                  Prisma schema links relations using declarative <code className="text-sky-300">@relation</code> fields, enabling type-safe <code className="text-sky-300">include</code> and nested relational joins without manual foreign key mapping.
                </p>
                <div className="pt-2 text-[10px] text-slate-500 font-mono">
                  Engine: PostgreSQL • Relational Integrity: Enforced
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
