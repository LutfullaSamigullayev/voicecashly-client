import { useEffect, useState } from 'react';

/**
 * Animated voice waveform — bell-curve envelope + dual-frequency wobble.
 * Pure DOM bars; inherits theme color via `bg-primary`.
 */
export function VoiceWaveform({
  bars = 56,
  height = 56,
  className = '',
}: {
  bars?: number;
  height?: number;
  className?: string;
}) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`flex items-center gap-[3px] ${className}`}
      style={{ height }}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const phase = i * 0.18;
        const env = Math.sin((i / bars) * Math.PI);
        const wobble = Math.sin(t * 2.4 + phase) * 0.5 + 0.5;
        const wobble2 = Math.sin(t * 4.1 + phase * 1.3) * 0.3 + 0.7;
        const h = 4 + env * (height - 12) * wobble * wobble2;
        return (
          <span
            key={i}
            className="w-[3px] rounded-[2px] bg-primary"
            style={{
              height: h,
              opacity: 0.6 + env * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
