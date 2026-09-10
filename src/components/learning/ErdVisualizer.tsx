import React, { useState } from 'react';
import { ParsedSchema, ParsedModel, ParsedField } from '../../lib/prisma-engine/schema-ast-parser';
import { Database, Key, Shield, Link2, Sparkles, Filter, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ErdVisualizerProps {
  ast: ParsedSchema;
}

export const ErdVisualizer: React.FC<ErdVisualizerProps> = ({ ast }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const modelNames = new Set(ast.models.map(m => m.name));

  const filteredModels = ast.models.filter(m =>
    m.name.toLowerCase().includes(filterText.toLowerCase()) ||
    m.fields.some(f => f.name.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="h-full flex flex-col bg-[#0B0F19] text-slate-200 overflow-hidden font-mono text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-slate-800 bg-[#111827]">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-100">Live Schema ERD</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
            {ast.models.length} Models • PostgreSQL Engine
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter models/fields..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-2.5 py-1 pl-7 rounded bg-[#080C14] border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 border border-slate-700/80 rounded bg-[#080C14] p-0.5">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1.5 text-[10px] text-slate-400 hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Relations Summary Bar */}
      <div className="px-3 py-1.5 bg-[#080C14] border-b border-slate-800/80 flex items-center space-x-3 text-[11px] overflow-x-auto">
        <span className="text-slate-500">Legend:</span>
        <span className="flex items-center space-x-1 text-amber-400">
          <Key className="w-3 h-3" />
          <span>PK Primary Key</span>
        </span>
        <span className="flex items-center space-x-1 text-purple-400">
          <Shield className="w-3 h-3" />
          <span>UQ Unique</span>
        </span>
        <span className="flex items-center space-x-1 text-blue-400">
          <Link2 className="w-3 h-3" />
          <span>FK / Relation</span>
        </span>
        <span className="text-emerald-400">1:N One-to-Many</span>
        <span className="text-indigo-400">1:1 One-to-One</span>
      </div>

      {/* ERD Canvas */}
      <div className="flex-1 overflow-auto p-6 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-transform duration-150"
        >
          {filteredModels.map((model) => {
            const isSelected = selectedModel === model.name;
            const relationFields = model.fields.filter(
              f => f.relation || modelNames.has(f.type)
            );

            return (
              <div
                key={model.name}
                onClick={() => setSelectedModel(model.name === selectedModel ? null : model.name)}
                className={`rounded-xl border shadow-xl bg-[#111827] overflow-hidden transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Model Header */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161F33] border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-slate-100 text-sm">{model.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {model.fields.length} fields
                  </span>
                </div>

                {/* Fields Table */}
                <div className="divide-y divide-slate-800/60 max-h-[320px] overflow-y-auto">
                  {model.fields.map((field) => {
                    const isId = field.isId;
                    const isUnique = field.isUnique;
                    const isRelation = !!field.relation || modelNames.has(field.type);

                    return (
                      <div
                        key={field.name}
                        className="px-3 py-1.5 flex items-center justify-between hover:bg-slate-800/30 text-xs"
                      >
                        <div className="flex items-center space-x-1.5 overflow-hidden">
                          {/* Badges */}
                          {isId && (
                            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                              PK
                            </span>
                          )}
                          {isUnique && !isId && (
                            <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                              UQ
                            </span>
                          )}
                          {isRelation && (
                            <span className="px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold border border-blue-500/30">
                              FK
                            </span>
                          )}

                          <span className={`font-mono truncate ${
                            isId ? 'font-bold text-amber-200' : isRelation ? 'text-blue-300' : 'text-slate-200'
                          }`}>
                            {field.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 text-[11px] font-mono">
                          <span className={isRelation ? 'text-blue-400' : 'text-slate-400'}>
                            {field.type}
                          </span>
                          {field.isOptional && <span className="text-amber-400">?</span>}
                          {field.isList && <span className="text-indigo-400">[]</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Model Relations Footer */}
                {relationFields.length > 0 && (
                  <div className="px-3 py-2 bg-[#0C1220] border-t border-slate-800 text-[10px] space-y-1">
                    <div className="text-slate-500 font-semibold uppercase tracking-wider">
                      Connected Relations:
                    </div>
                    {relationFields.map((field, idx) => {
                      const cardinality = field.isList ? '1:N (List)' : '1:1 (Single)';
                      return (
                        <div key={idx} className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Link2 className="w-3 h-3 text-indigo-400" />
                            <span className="text-slate-200 font-semibold">{field.type}</span>
                          </span>
                          <span className="text-indigo-300 font-mono">{cardinality}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
