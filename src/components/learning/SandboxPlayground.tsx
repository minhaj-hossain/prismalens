import React, { useState } from 'react';
import { MonacoCodeEditor } from './MonacoCodeEditor';
import { ResultConsole } from './ResultConsole';
import { InBrowserPrismaEngine } from '../../lib/prisma-engine/proxy-executor';
import { GeneratedSqlResult } from '../../types/curriculum';
import { ECOM_SCHEMA_PRISMA } from '../../content/database/seed-schemas';
import { Code2, Play, Sparkles, Terminal, Database, BookOpen } from 'lucide-react';

interface SandboxPlaygroundProps {
  engine: InBrowserPrismaEngine;
}

const TEMPLATE_QUERIES = [
  {
    name: 'All Users with Orders',
    code: `// Retrieve all users with their orders and items
return await prisma.user.findMany({
  include: {
    orders: {
      include: {
        items: true
      }
    }
  }
});`
  },
  {
    name: 'High-Value Active Products',
    code: `// Find products with price >= 50 and stock > 0
return await prisma.product.findMany({
  where: {
    price: { gte: 50 },
    stock: { gt: 0 }
  },
  orderBy: {
    price: 'desc'
  },
  select: {
    id: true,
    title: true,
    price: true,
    stock: true
  }
});`
  },
  {
    name: 'Search Users by Query',
    code: `// Filter users by case-insensitive name or email
return await prisma.user.findMany({
  where: {
    OR: [
      { name: { contains: 'alice', mode: 'insensitive' } },
      { email: { contains: 'prisma', mode: 'insensitive' } }
    ]
  }
});`
  },
  {
    name: 'Atomic Stock Decrement',
    code: `// Atomically decrement stock for product 1
return await prisma.product.update({
  where: { id: 1 },
  data: {
    stock: { decrement: 2 }
  }
});`
  },
  {
    name: 'Create User with Profile',
    code: `// Nested create: user + profile
return await prisma.user.create({
  data: {
    email: 'newdeveloper@prisma.io',
    name: 'Dev Explorer',
    profile: {
      create: {
        bio: 'Learning Prisma v7 with PrismaLens'
      }
    }
  },
  include: {
    profile: true
  }
});`
  }
];

export const SandboxPlayground: React.FC<SandboxPlaygroundProps> = ({ engine }) => {
  const [code, setCode] = useState(TEMPLATE_QUERIES[0].code);
  const [activeTab, setActiveTab] = useState<'editor' | 'schema'>('editor');
  const [consoleTab, setConsoleTab] = useState<'result' | 'sql' | 'type' | 'logs'>('result');
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultData, setResultData] = useState<any>(undefined);
  const [sqlResult, setSqlResult] = useState<GeneratedSqlResult | undefined>(undefined);
  const [inferredType, setInferredType] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [errorCode, setErrorCode] = useState<string | undefined>(undefined);

  const handleRun = async () => {
    setIsExecuting(true);
    setErrorMessage(undefined);
    setErrorCode(undefined);

    try {
      const outcome = await engine.executeUserQuery(code);
      if (outcome.success) {
        setResultData(outcome.data);
        const lastLog = outcome.queryLogs[outcome.queryLogs.length - 1];
        if (lastLog?.sql) {
          setSqlResult({
            sql: lastLog.sql.rawSql,
            parameters: lastLog.sql.parameters,
            executionPlan: lastLog.sql.executionPlan,
            durationMs: lastLog.sql.durationMs,
            isIndexScan: lastLog.sql.isIndexScan,
            isNPlusOneWarning: (lastLog.sql.warnings?.length ?? 0) > 0,
            nPlusOneExplanation: lastLog.sql.warnings?.join(' ')
          });
        }
        setInferredType(outcome.inferredType);
      } else {
        setErrorMessage(outcome.error?.message || 'Query execution failed');
        setErrorCode(outcome.error?.code || 'PrismaClientError');
        setResultData(undefined);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Execution error');
      setErrorCode('RuntimeError');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#0B0F19] text-slate-200 overflow-hidden font-mono text-xs">
      {/* Top Banner with Templates */}
      <div className="p-3 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-slate-100">Interactive Prisma Sandbox</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Unrestricted Client Execution
          </span>
        </div>

        {/* Template Selectors */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-slate-500 text-[11px] mr-1">Templates:</span>
          {TEMPLATE_QUERIES.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(t.code);
                setResultData(undefined);
                setErrorMessage(undefined);
              }}
              className="px-2.5 py-1 rounded bg-[#080C14] hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-y-auto">
        {/* Left Side: Editor & Schema Tabs */}
        <div className="flex flex-col h-full space-y-3 overflow-y-auto">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              query.ts
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              schema.prisma
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'editor' ? (
              <MonacoCodeEditor
                value={code}
                onChange={setCode}
                onRun={handleRun}
                onReset={() => setCode(TEMPLATE_QUERIES[0].code)}
                isExecuting={isExecuting}
                language="typescript"
              />
            ) : (
              <div className="h-full rounded-xl border border-slate-800 bg-[#080C14] p-4 overflow-auto font-mono text-xs text-slate-300">
                <pre className="whitespace-pre">{ECOM_SCHEMA_PRISMA}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Result Console (JSON, SQL Lens, Inferred Type) */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Execution Inspector</span>
            <span className="text-[10px] text-slate-500 lowercase">live postgres simulation</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ResultConsole
              activeTab={consoleTab}
              onTabChange={setConsoleTab}
              resultData={resultData}
              sqlResult={sqlResult}
              inferredType={inferredType}
              errorMessage={errorMessage}
              errorCode={errorCode}
              isExecuting={isExecuting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
