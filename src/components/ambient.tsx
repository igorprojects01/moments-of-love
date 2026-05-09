import { useEffect, useRef, useState } from "react";

export function ParticleField({ density = 40 }: { density?: number }) {
  const particles = Array.from({ length: density });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 6 + Math.random() * 8;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-rose-glow"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              animation: `shimmer ${duration}s ease-in-out ${delay}s infinite`,
              boxShadow: `0 0 ${size * 4}px oklch(0.78 0.2 10 / 0.8)`,
            }}
          />
        );
      })}
    </div>
  );
}

export function FallingHearts({ count = 18 }: { count?: number }) {
  const hearts = Array.from({ length: count });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 12;
        const duration = 10 + Math.random() * 14;
        const size = 12 + Math.random() * 18;
        const opacity = 0.4 + Math.random() * 0.4;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              opacity,
              animation: `float-up ${duration}s linear ${delay}s infinite`,
              filter: "drop-shadow(0 0 8px oklch(0.75 0.22 10 / 0.7))",
            }}
          >
            <path
              d="M12 21s-7-4.5-9.5-9C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8-2.5 4.5-9.5 9-9.5 9z"
              fill="url(#g)"
            />
            <defs>
              <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.22 10)" />
                <stop offset="100%" stopColor="oklch(0.55 0.24 18)" />
              </linearGradient>
            </defs>
          </svg>
        );
      })}
    </div>
  );
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        a.volume = 0;
        await a.play();
        setPlaying(true);
        // fade in
        let v = 0;
        const target = volume;
        const step = setInterval(() => {
          v += 0.04;
          if (v >= target) { v = target; clearInterval(step); }
          if (a) a.volume = v;
        }, 100);
      } catch {/* autoplay blocked */}
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar" : "Tocar"}
        className="size-9 rounded-full gradient-rose flex items-center justify-center text-white hover:scale-110 transition-transform"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 accent-[oklch(0.7_0.22_12)]"
        aria-label="Volume"
      />
    </div>
  );
}
