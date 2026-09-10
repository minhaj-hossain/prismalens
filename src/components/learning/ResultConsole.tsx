import React, { useState } from 'react';
import { GeneratedSqlResult } from '../../types/curriculum';
import { GeneratedSqlLens } from './GeneratedSqlLens';
import { TypeInspector } from './TypeInspector';
import {
  Terminal,
  Database,
  FileCode,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  ListTree
} from 'lucide-react';

interface ResultConsoleProps {
  activeTab: 'result' | 'sql' | 'type' | 'logs';
  onTabChange: (tab: 'result' | 'sql' | 'type' | 'logs') => void;
  resultData: any;
  sqlResult?: GeneratedSqlResult;
  inferredType?: string;
  errorMessage?: string;
  errorCode?: string;
  isExecuting?: boolean;
  modelName?: string;
}

export const ResultConsole: React.FC<ResultConsoleProps> = ({
  activeTab,
  onTabChange,
  resultData,
  sqlResult,
  inferredType,
  errorMessage,
  errorCode,
  isExecuting = false,
  modelName = 'User'
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyResult = () => {
    if (!resultData) return;
    navigator.clipboard.writeText(JSON.stringify(resultData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasError = !!errorMessage;
  const rowCount = Array.isArray(resultData)
    ? resultData.length
    : resultData && typeof resultData === 'object'
    ? 1
    : 0;

  return (
    <div
      className={`flex flex-col rounded-xl border border-slate-800 bg-[#0B0F19] overflow-hidden transition-all duration-200 shadow-2xl ${
        isExpanded ? 'h-[500px]' : 'h-[280px]'
      }`}
    >
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-3 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center space-x-1">
          {/* Result Tab */}
          <button
            onClick={() => onTabChange('result')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'result'
                ? hasError
                  ? 'border-rose-500 text-rose-400 bg-rose-950/20'
                  : 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {hasError ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
            <span>Query Result</span>
            {!hasError && resultData !== undefined && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {rowCount} {rowCount === 1 ? 'row' : 'rows'}
              </span>
            )}
          </button>

          {/* Generated SQL Tab */}
          <button
            onClick={() => onTabChange('sql')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'sql'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>What happens in DB</span>
            {sqlResult && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                {sqlResult.durationMs.toFixed(1)}ms
              </span>
            )}
          </button>

          {/* Inferred Type Tab */}
          <button
            onClick={() => onTabChange('type')}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-mono font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'type'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Inferred Type</span>
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-2">
          {activeTab === 'result' && resultData && !hasError && (
            <button
              onClick={handleCopyResult}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title={isExpanded ? 'Collapse Console' : 'Expand Console'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-auto">
        {isExecuting ? (
          <div className="h-full flex items-center justify-center space-x-2 text-slate-400 font-mono text-xs">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Executing query against in-memory PostgreSQL engine...</span>
          </div>
        ) : hasError ? (
          <div className="p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs">
                {errorCode || 'PrismaClientError'}
              </span>
              <span className="text-slate-400">Database Query Exception</span>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre-wrap">{errorMessage}</pre>
            </div>
          </div>
        ) : activeTab === 'result' ? (
          resultData !== undefined ? (
            <div className="p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre">
                {JSON.stringify(resultData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
              <Terminal className="w-8 h-8 text-slate-600 mb-2 opacity-60" />
              <p>Ready. Click "Run Query" or press ⌘+Enter to execute.</p>
            </div>
          )
        ) : activeTab === 'sql' ? (
          <GeneratedSqlLens sqlResult={sqlResult} />
        ) : activeTab === 'type' ? (
          <TypeInspector inferredType={inferredType} modelName={modelName} />
        ) : null}
      </div>
    </div>
  );
};
