import { Moon, Settings, Sun } from 'lucide-react';
import type { SkillLevel } from '../types';

interface HeaderProps {
  darkMode: boolean;
  email?: string | null;
  level?: SkillLevel | null;
  onToggleDark: () => void;
  onOpenSettings: () => void;
  onChangeLevel?: () => void;
  onLogout?: () => void;
}

export function Header({
  darkMode,
  email,
  level,
  onToggleDark,
  onOpenSettings,
  onChangeLevel,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Lion English
          </p>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            IELTS Speaking Simulator
          </h1>
          {email && (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {email}
              {level ? ` · ${level}` : ''}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onChangeLevel && (
            <button
              type="button"
              onClick={onChangeLevel}
              className="hidden rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 sm:inline dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Level
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="hidden rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 sm:inline dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Log out
            </button>
          )}
          <button
            type="button"
            onClick={onToggleDark}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
