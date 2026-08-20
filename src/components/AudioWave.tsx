interface AudioWaveProps {
  active: boolean;
  bars?: number;
}

export function AudioWave({ active, bars = 5 }: AudioWaveProps) {
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-full bg-emerald-500 ${active ? 'animate-wave' : 'h-2'}`}
          style={active ? { animationDelay: `${i * 0.12}s`, height: 16 } : undefined}
        />
      ))}
    </div>
  );
}
