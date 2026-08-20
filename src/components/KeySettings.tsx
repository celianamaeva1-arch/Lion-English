import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';

interface KeySettingsProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSave: (next: AppSettings) => void;
}

export function KeySettings({ open, settings, onClose, onSave }: KeySettingsProps) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Gemini API key
        </label>
        <input
          type="password"
          value={draft.apiKey}
          onChange={(e) => setDraft((s) => ({ ...s, apiKey: e.target.value }))}
          placeholder="Paste key from Google AI Studio"
          className="mb-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
        />
        <p className="mb-6 text-xs text-slate-500">
          Stored only in this browser. Evaluation, follow-ups, TTS, and images need a key.
          Speech-to-text works without one.
        </p>

        <label className="mb-4 flex items-center justify-between gap-3 text-sm">
          <span>Auto-speak questions</span>
          <input
            type="checkbox"
            checked={draft.autoSpeak}
            onChange={(e) => setDraft((s) => ({ ...s, autoSpeak: e.target.checked }))}
            className="h-4 w-4 accent-indigo-600"
          />
        </label>

        <label className="mb-6 flex items-center justify-between gap-3 text-sm">
          <span>Dark mode</span>
          <input
            type="checkbox"
            checked={draft.darkMode}
            onChange={(e) => setDraft((s) => ({ ...s, darkMode: e.target.checked }))}
            className="h-4 w-4 accent-indigo-600"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            onSave(draft);
            onClose();
          }}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </aside>
    </div>
  );
}
