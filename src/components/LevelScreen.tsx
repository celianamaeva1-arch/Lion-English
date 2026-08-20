import { GraduationCap, Rocket, Sprout } from 'lucide-react';
import type { SkillLevel } from '../types';

const LEVELS: {
  id: SkillLevel;
  title: string;
  blurb: string;
  icon: typeof Sprout;
}[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    blurb: 'Shorter answers, everyday Part 1 topics, gentler pace',
    icon: Sprout,
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    blurb: 'Balanced practice across Parts 1–3 with standard timing',
    icon: GraduationCap,
  },
  {
    id: 'advanced',
    title: 'Advanced',
    blurb: 'Longer turns, denser Part 3 discussion, exam pressure',
    icon: Rocket,
  },
];

interface LevelScreenProps {
  email: string;
  onSelect: (level: SkillLevel) => void;
  onLogout: () => void;
}

export function LevelScreen({ email, onSelect, onLogout }: LevelScreenProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Choose your level
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Signed in as <span className="font-medium text-slate-700 dark:text-slate-200">{email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="shrink-0 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Log out
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {LEVELS.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-indigo-600 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {level.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{level.blurb}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
