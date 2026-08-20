import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  seconds: number;
  label: string;
  running: boolean;
  onComplete?: () => void;
  warnBelow?: number;
}

export function Timer({
  seconds,
  label,
  running,
  onComplete,
  warnBelow = 10,
}: TimerProps) {
  const [left, setLeft] = useState(seconds);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setLeft(seconds);
    doneRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }
    const id = window.setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left, running]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const urgent = left <= warnBelow;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`font-mono text-3xl font-semibold tabular-nums ${
          urgent ? 'text-amber-500' : 'text-indigo-600 dark:text-indigo-400'
        }`}
      >
        {mm}:{ss}
      </span>
    </div>
  );
}
