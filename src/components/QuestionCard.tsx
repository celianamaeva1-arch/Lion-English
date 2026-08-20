import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  imageUrl?: string | null;
  imageLoading?: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  imageUrl,
  imageLoading,
}: QuestionCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          Part {question.part}
        </span>
        <span className="text-xs text-slate-500">
          Question {index + 1} / {total}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          {question.topic}
        </p>
        <h2 className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {question.prompt}
        </h2>
        {question.bullets && (
          <ul className="mb-1 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li className="list-none -ml-5 mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              You should say:
            </li>
            {question.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {question.tip && (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
            <span className="font-semibold">Tip: </span>
            {question.tip}
          </p>
        )}
        {question.part === 2 && (
          <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            {imageLoading ? (
              <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                Generating visual cue…
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Cue card scene" className="h-48 w-full object-cover" />
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                Visual cue unavailable (optional with API key)
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
