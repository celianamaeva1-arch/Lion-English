import { Mic, MicOff, Square } from 'lucide-react';
import { AudioWave } from './AudioWave';

interface AudioRecorderProps {
  supported: boolean;
  listening: boolean;
  displayText: string;
  onStart: () => void;
  onStop: () => void;
  onChangeText: (value: string) => void;
}

export function AudioRecorder({
  supported,
  listening,
  displayText,
  onStart,
  onStop,
  onChangeText,
}: AudioRecorderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!supported}
          onClick={() => (listening ? onStop() : onStart())}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full text-white transition ${
            listening
              ? 'bg-rose-500 shadow-lg shadow-rose-500/30 animate-pulse-ring'
              : 'bg-indigo-600 hover:bg-indigo-500'
          } disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label={listening ? 'Stop recording' : 'Start recording'}
        >
          {listening ? <Square className="h-6 w-6 fill-current" /> : <Mic className="h-7 w-7" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {supported ? (
              listening ? (
                <>
                  <AudioWave active />
                  <span>Listening… hold or click to stop</span>
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4" />
                  <span>Hold or click the mic to speak</span>
                </>
              )
            ) : (
              <span>Speech recognition unavailable — type your answer below</span>
            )}
          </div>
        </div>
      </div>
      <textarea
        value={displayText}
        onChange={(e) => onChangeText(e.target.value)}
        rows={4}
        placeholder="Your spoken answer will appear here…"
        className="w-full resize-y rounded-xl border border-slate-200 bg-white/80 p-3 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/70"
      />
    </div>
  );
}
