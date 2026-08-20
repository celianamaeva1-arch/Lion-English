import { BookOpen, Layers, MessageCircle, Mic2 } from 'lucide-react';
import type { ExamMode } from '../types';

const MODES: {
  id: ExamMode;
  title: string;
  blurb: string;
  icon: typeof Mic2;
}[] = [
  {
    id: 'part1',
    title: 'Part 1',
    blurb: 'Interview warm-up — short personal questions',
    icon: MessageCircle,
  },
  {
    id: 'part2',
    title: 'Part 2',
    blurb: 'Cue card — 1 min prep, up to 2 min speaking',
    icon: BookOpen,
  },
  {
    id: 'part3',
    title: 'Part 3',
    blurb: 'Discussion — deeper abstract questions',
    icon: Mic2,
  },
  {
    id: 'full',
    title: 'Full Test',
    blurb: 'Parts 1 → 2 → 3 with band evaluation',
    icon: Layers,
  },
];

interface ModeSelectorProps {
  onSelect: (mode: ExamMode) => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{mode.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{mode.blurb}</p>
          </button>
        );
      })}
    </div>
  );
}
