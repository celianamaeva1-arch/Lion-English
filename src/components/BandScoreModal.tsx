import { X } from 'lucide-react';
import type { BandEvaluation } from '../types';

interface BandScoreModalProps {
  open: boolean;
  evaluation: BandEvaluation | null;
  onClose: () => void;
  onRestart: () => void;
}

export function BandScoreModal({
  open,
  evaluation,
  onClose,
  onRestart,
}: BandScoreModalProps) {
  if (!open || !evaluation) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Estimated band
            </p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {evaluation.overall.toFixed(1)}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close results">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {evaluation.criteria.map((c) => (
            <div
              key={c.name}
              className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400">
                  {Number(c.band).toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.feedback}</p>
            </div>
          ))}
        </div>

        {evaluation.strengths.length > 0 && (
          <section className="mt-4">
            <h3 className="mb-1 text-sm font-semibold text-emerald-600">Strengths</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {evaluation.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {evaluation.improvements.length > 0 && (
          <section className="mt-4">
            <h3 className="mb-1 text-sm font-semibold text-amber-600">Improvements</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {evaluation.improvements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {evaluation.modelAnswer && (
          <section className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <h3 className="mb-1 text-sm font-semibold">Model answer idea</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{evaluation.modelAnswer}</p>
          </section>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Practice again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
