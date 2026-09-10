import React, { useState } from 'react';
import { ModuleData, Concept } from '../../types/curriculum';
import { InteractiveConceptVisual } from './InteractiveConceptVisual';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Database,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface ConceptTheoryViewProps {
  module: ModuleData;
  concept: Concept;
  conceptIndex: number;
  totalConcepts: number;
  isCompleted?: boolean;
  onBackToOverview: () => void;
  onStartPractice: () => void;
  onSelectConcept: (conceptId: string) => void;
}

export const ConceptTheoryView: React.FC<ConceptTheoryViewProps> = ({
  module,
  concept,
  conceptIndex,
  totalConcepts,
  onBackToOverview,
  onStartPractice,
  onSelectConcept
}) => {
  // Quick Check MCQ State
  const primaryMcq = concept.theory.mcqs && concept.theory.mcqs.length > 0 ? concept.theory.mcqs[0] : null;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
  };

  const isCorrect = primaryMcq && selectedOption === primaryMcq.correctIndex;

  return (
    <div className="flex-1 bg-[#0B0F19] text-slate-100 overflow-y-auto p-4 sm:p-8 font-sans text-xs selection:bg-indigo-900/60 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Navigation / Progress Top Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <button
            onClick={onBackToOverview}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>

          {/* Lesson Counter & Concept Stepper */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">
              Day {module.day.toString().padStart(2, '0')} · Concept {conceptIndex + 1} of {totalConcepts}
            </span>
            <div className="flex items-center space-x-1.5 bg-[#111827] px-2 py-1 rounded-lg border border-slate-800">
              {module.concepts.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => onSelectConcept(c.id)}
                  className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                    idx === conceptIndex
                      ? 'bg-indigo-500 ring-2 ring-indigo-500/40'
                      : idx < conceptIndex
                      ? 'bg-emerald-400'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Concept ${idx + 1}: ${c.title}`}
                />
              ))}
            </div>
          </div>

          {/* Start Practice Header CTA */}
          <button
            onClick={onStartPractice}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Practice →</span>
          </button>
        </div>

        {/* Concept Title Header */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
            Concept {conceptIndex + 1} of {totalConcepts} · Core Mental Model
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {concept.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            {concept.shortDescription}
          </p>
        </div>

        {/* 1. WHAT PROBLEM DOES THIS SOLVE? */}
        <section className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>What Problem Does This Solve?</span>
          </div>

          <div className="space-y-3 text-slate-300 leading-relaxed text-sm">
            <p>{concept.theory.summary}</p>
            {concept.theory.explanation && concept.theory.explanation.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                {concept.theory.explanation.map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300 text-xs sm:text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {concept.theory.keyTakeaway && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Pragmatic Rule: </span>
                <span>{concept.theory.keyTakeaway}</span>
              </div>
            </div>
          )}
        </section>

        {/* 2. THE PATTERN (Prisma Client vs What Happens in the Database) */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>The Pattern: Prisma Client vs. What Happens in the Database</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Prisma Client */}
            <div className="rounded-xl border border-slate-800 bg-[#0E1320] overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-[#131B2E] border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center space-x-1.5 font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Prisma Client</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  {concept.theory.targetHero.language.toUpperCase()}
                </span>
              </div>
              <div className="p-4 bg-[#070A10] flex-1">
                <pre className="text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
                  {concept.theory.targetHero.code}
                </pre>
              </div>
              {concept.theory.targetHero.explanation && (
                <div className="p-3 bg-[#0E1320] border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {concept.theory.targetHero.explanation}
                </div>
              )}
            </div>

            {/* Right: What Happens in the Database */}
            <div className="rounded-xl border border-slate-800 bg-[#0E1320] overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-[#131B2E] border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center space-x-1.5 font-mono">
                  <Database className="w-3.5 h-3.5" />
                  <span>What happens in the database</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">SQL / Execution Plan</span>
              </div>
              <div className="p-4 bg-[#070A10] flex-1">
                <pre className="text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre">
                  {concept.id.includes('relation') || concept.id.includes('include')
                    ? `-- Prisma executes 2 batched queries (or a JOIN depending on relation mode):\n\n-- Query 1: Fetch matching parent records\nSELECT "id", "email", "name" FROM "User" WHERE "id" = 1 LIMIT 1;\n\n-- Query 2: Batch-hydrate child records via IN (...)\nSELECT "id", "userId", "total", "status"\nFROM "Order"\nWHERE "userId" IN (1);`
                    : concept.id.includes('create') || concept.id.includes('insert')
                    ? `INSERT INTO "User" ("email", "name", "role")\nVALUES ('alex@example.com', 'Alex', 'USER')\nRETURNING "id", "email", "name", "role";`
                    : concept.id.includes('update')
                    ? `UPDATE "User"\nSET "role" = 'ADMIN'\nWHERE "id" = 1\nRETURNING *;`
                    : concept.id.includes('delete')
                    ? `DELETE FROM "User" WHERE "id" = 1 RETURNING "id";`
                    : concept.id.includes('filter') || concept.id.includes('where')
                    ? `SELECT * FROM "User"\nWHERE "email" = 'alex@example.com'\n  AND "role" = 'ADMIN'\nLIMIT 1;`
                    : `-- Generated PostgreSQL DDL Statement\nCREATE TABLE "User" (\n  "id" SERIAL PRIMARY KEY,\n  "email" TEXT NOT NULL,\n  "name" TEXT,\n  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()\n);\nCREATE UNIQUE INDEX "User_email_key" ON "User"("email");`}
                </pre>
              </div>
              <div className="p-3 bg-[#0E1320] border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                Prisma constructs parameterized SQL, executes across connection pools, and parses rows into strongly-typed objects.
              </div>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE VISUAL & MENTAL MODEL */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Interactive Mental Model (Click &amp; Observe)</span>
          </div>

          <InteractiveConceptVisual
            conceptId={concept.id}
            conceptTitle={concept.title}
          />
        </section>

        {/* 4. QUICK CHECK (1 Question to verify mental model before coding) */}
        {primaryMcq && (
          <section className="rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Quick Check: Verify Your Mental Model</span>
            </div>

            <p className="text-sm font-semibold text-white">
              {primaryMcq.question}
            </p>

            <div className="space-y-2">
              {primaryMcq.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isOptionCorrect = idx === primaryMcq.correctIndex;

                let optionClass =
                  'border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isSelected) {
                    optionClass = isOptionCorrect
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                      : 'border-rose-500 bg-rose-950/40 text-rose-200';
                  } else if (isOptionCorrect) {
                    optionClass = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-sans flex items-center justify-between transition cursor-pointer ${optionClass}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isSelected && (
                      <span>
                        {isOptionCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start space-x-2 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold">
                    {isCorrect ? 'Correct!' : 'Not quite.'}{' '}
                  </span>
                  <span>{primaryMcq.explanation}</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5. START PRACTICE CTA (FOOTER) */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToOverview}
            className="flex items-center space-x-2 text-slate-400 hover:text-white text-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Roadmap</span>
          </button>

          <button
            onClick={onStartPractice}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
          >
            <span>Start Practice (Task 1 of {concept.tasks.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
