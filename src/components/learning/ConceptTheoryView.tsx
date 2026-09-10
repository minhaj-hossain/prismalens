import React, { useState } from 'react';
import { ModuleData, Concept } from '../../types/curriculum';
import { getConceptVisualModel, VisualTable } from '../../lib/curriculum/conceptVisuals';
import { ConceptVisualSwitch } from '../visuals/ConceptVisualSwitch';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Database,
  Sparkles,
  CheckCircle2,
  XCircle,
  Code2
} from 'lucide-react';

interface ConceptTheoryViewProps {
  module: ModuleData;
  concept: Concept;
  conceptIndex: number;
  totalConcepts: number;
  isCompleted?: boolean;
  onBackToOverview: () => void;
  onStartPractice: (conceptId?: string, taskId?: string) => void;
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
  const [hasCopied, setHasCopied] = useState(false);
  const visualModel = getConceptVisualModel(concept, module);

  // Quick Check MCQ State
  const primaryMcq = concept.theory.mcqs && concept.theory.mcqs.length > 0 ? concept.theory.mcqs[0] : null;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
  };

  const isCorrect = primaryMcq && selectedOption === primaryMcq.correctIndex;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(visualModel.queryBreakdown.code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const isLastConcept = conceptIndex === totalConcepts - 1;

  const handleNextAction = () => {
    onStartPractice(concept.id, concept.tasks[0]?.id);
  };

  const handlePrevAction = () => {
    if (conceptIndex > 0) {
      const prevConcept = module.concepts[conceptIndex - 1];
      if (prevConcept) {
        onSelectConcept(prevConcept.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Render a visual table matching the reference UI
  const renderVisualTable = (table: VisualTable) => {
    return (
      <div className="rounded-xl border border-sky-950/80 bg-[#050B14] overflow-hidden my-3">
        {/* Table Header Bar */}
        <div className="px-4 py-2.5 bg-[#071222] border-b border-sky-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono text-xs select-none">🗄️</span>
            <span className="font-mono font-bold text-xs text-sky-300">
              {table.title}
            </span>
          </div>
          {table.badge && (
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              {table.badge}
            </span>
          )}
        </div>

        {/* Table Data Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-sky-950/80 bg-[#060D1A]">
                {table.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="py-2.5 px-3 sm:px-4 text-sky-400 font-semibold tracking-wider text-[11px] uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-950/40">
              {table.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-sky-950/20 transition-colors">
                  {table.columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-3 sm:px-4 text-slate-300 whitespace-nowrap">
                      {typeof row[col] === 'boolean'
                        ? row[col] ? 'true' : 'false'
                        : row[col] ?? 'NULL'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Counter */}
        <div className="px-4 py-2 bg-[#040810] border-t border-sky-950/60 text-slate-500 font-mono text-[11px]">
          {table.countLabel}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#060B13] text-slate-100 overflow-y-auto py-8 sm:py-12 px-4 selection:bg-sky-900/60 selection:text-white">
      {/* ----------------------------------------------------------------- */}
      {/* TOP HEADER OUTSIDE THE CARD (Matching Reference Image)            */}
      {/* ----------------------------------------------------------------- */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4">
        <button
          onClick={onBackToOverview}
          className="flex items-center space-x-2 text-slate-400 hover:text-white font-mono text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Roadmap</span>
        </button>

        <div className="border border-sky-950/80 bg-[#071322] px-3.5 py-1.5 rounded-lg text-slate-300 font-mono text-xs font-semibold">
          Day {module.day} of 14
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN CONCEPT CONTAINER CARD (Matching Reference Screenshot)      */}
      {/* ----------------------------------------------------------------- */}
      <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl border border-sky-900/40 bg-[#07101E] p-6 sm:p-8 md:p-10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)]">
        {/* Top Status & Next Button Row */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-sky-950/80">
          {/* Breadcrumb Left */}
          <div className="font-mono text-xs text-sky-400 font-medium truncate max-w-[200px] sm:max-w-md">
            Prisma Day {module.day} / {conceptIndex + 1}. {concept.title}
          </div>

          {/* Stepper Dots & Next Button Right */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Dots */}
            <div className="flex items-center space-x-1.5">
              {module.concepts.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => onSelectConcept(c.id)}
                  className={`w-2 h-2 rounded-full transition cursor-pointer ${
                    idx === conceptIndex
                      ? 'bg-sky-400 ring-2 ring-sky-400/40'
                      : idx < conceptIndex
                      ? 'bg-emerald-400'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Concept ${idx + 1}: ${c.title}`}
                />
              ))}
            </div>

            {/* Next / Practice Button */}
            <button
              onClick={handleNextAction}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-sky-400/20 transition hover:scale-[1.02] cursor-pointer"
            >
              <span>Practice Task →</span>
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* CONCEPT HEADING & HOOK                                         */}
        {/* --------------------------------------------------------------- */}
        <div className="mt-6 mb-6">
          <h1 className="font-mono font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-snug">
            {conceptIndex + 1}. {concept.title}
          </h1>

          <p className="font-sans text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-2.5">
            {visualModel.leadHook}
          </p>

          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed mt-3">
            {visualModel.introText}
          </p>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* DYNAMIC CONCEPT VISUALIZER ARCHETYPE                            */}
        {/* --------------------------------------------------------------- */}
        <div className="mb-6">
          <ConceptVisualSwitch concept={concept} module={module} />
        </div>

        {/* --------------------------------------------------------------- */}
        {/* TWO CONCEPTUAL QUESTION CARDS                                   */}
        {/* --------------------------------------------------------------- */}
        <div className="mb-6">
          <p className="font-sans text-xs sm:text-sm text-slate-300 mb-3">
            When you write a type-safe Prisma query, you answer two simple questions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Card 1 */}
            <div className="p-4 rounded-xl bg-[#050C18] border border-sky-950/80">
              <div className="inline-block px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-sky-400 font-mono text-[10px] uppercase font-bold mb-2">
                {visualModel.questions[0].tag}
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-white">
                {visualModel.questions[0].question}
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 rounded-xl bg-[#050C18] border border-sky-950/80">
              <div className="inline-block px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/60 text-sky-400 font-mono text-[10px] uppercase font-bold mb-2">
                {visualModel.questions[1].tag}
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-white">
                {visualModel.questions[1].question}
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* THE QUERY WE'RE GOING TO BREAK DOWN                             */}
        {/* --------------------------------------------------------------- */}
        <div className="mb-8">
          <p className="font-sans text-xs sm:text-sm text-slate-300 mb-2.5">
            Let's see how Prisma processes a query that asks for only specific fields:
          </p>

          <div className="rounded-xl border border-sky-900/50 bg-[#040A14] overflow-hidden shadow-inner">
            {/* Code Box Header */}
            <div className="px-4 py-2.5 bg-[#060E1C] border-b border-sky-950/80 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-400">
                {visualModel.queryBreakdown.title}
              </span>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-[#0A1628] hover:bg-[#0E203A] border border-sky-900/40 text-slate-400 hover:text-white font-mono text-[10px] transition cursor-pointer"
              >
                {hasCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 sm:p-5 overflow-x-auto">
              <pre className="font-mono text-xs sm:text-sm text-sky-300 leading-relaxed whitespace-pre">
                {visualModel.queryBreakdown.code}
              </pre>
            </div>

            {/* Explanation Footer */}
            <div className="px-4 py-2.5 bg-[#050B16] border-t border-sky-950/60 text-[11px] font-sans text-slate-400">
              {visualModel.queryBreakdown.explanation}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* STEP-BY-STEP PRISMA PROCESSING                                  */}
        {/* --------------------------------------------------------------- */}
        <div className="mb-8">
          <div className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-4">
            STEP-BY-STEP PRISMA PROCESSING
          </div>

          <div className="space-y-6">
            {visualModel.processingSteps.map((step) => (
              <div key={step.number} className="space-y-2">
                {/* Step Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center font-mono text-[11px] font-bold">
                      {step.number}
                    </div>
                    <span className="font-mono font-bold text-xs sm:text-sm text-white">
                      {step.title}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-900/60 text-sky-400 font-mono text-[10px] shrink-0 font-semibold">
                    {step.pillBadge}
                  </span>
                </div>

                {/* Step Description */}
                <p className="font-sans text-xs text-slate-300 pl-7 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Visual Table (if present) */}
                {step.table && (
                  <div className="pl-7">
                    {renderVisualTable(step.table)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* MEANING OF THE QUERY & TAKEAWAYS                                */}
        {/* --------------------------------------------------------------- */}
        <div className="mb-8 pt-6 border-t border-sky-950/80">
          <div className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">
            MEANING OF THE QUERY
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 font-sans leading-relaxed">
            {visualModel.meaningSummary.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-sky-400 font-mono font-bold select-none">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {concept.theory.keyTakeaway && (
            <div className="mt-4 p-4 rounded-xl bg-[#091526] border border-sky-500/30 flex items-start space-x-3 text-xs text-sky-200">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white font-mono">Pragmatic Rule: </span>
                <span className="font-sans">{concept.theory.keyTakeaway}</span>
              </div>
            </div>
          )}
        </div>

        {/* --------------------------------------------------------------- */}
        {/* QUICK KNOWLEDGE CHECK (MCQ)                                     */}
        {/* --------------------------------------------------------------- */}
        {primaryMcq && (
          <div className="mb-8 p-5 rounded-2xl bg-[#050C18] border border-sky-950/80">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-300 font-mono uppercase tracking-wider mb-3">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Quick Knowledge Check</span>
            </div>

            <p className="font-sans text-xs sm:text-sm font-semibold text-white mb-3 leading-relaxed">
              {primaryMcq.question}
            </p>

            <div className="space-y-2">
              {primaryMcq.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === primaryMcq.correctIndex;

                let optionStyles = 'bg-[#081222] border-sky-950 hover:border-sky-700/60 text-slate-300';
                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    optionStyles = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = 'bg-rose-950/40 border-rose-500/60 text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border font-sans text-xs sm:text-[13px] transition flex items-center justify-between gap-3 cursor-pointer ${optionStyles}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div
                className={`mt-3.5 p-3 rounded-xl border text-xs font-sans leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                }`}
              >
                <span className="font-bold font-mono">
                  {isCorrect ? 'Correct! ' : 'Explanation: '}
                </span>
                <span>{primaryMcq.explanation}</span>
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------- */}
        {/* BOTTOM ACTION FOOTER                                            */}
        {/* --------------------------------------------------------------- */}
        <div className="pt-6 border-t border-sky-950/80 flex items-center justify-between gap-4">
          {conceptIndex > 0 ? (
            <button
              onClick={handlePrevAction}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#091526] hover:bg-[#0E203A] border border-sky-950 text-slate-300 hover:text-white font-mono text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Concept</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNextAction}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-mono font-bold text-xs sm:text-sm shadow-lg shadow-sky-400/20 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Start Practice Task</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
