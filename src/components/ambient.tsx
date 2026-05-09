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

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VIDEO_ID = "gzKntWygy8o";

export function MusicPlayer() {
  const playerRef = useRef<any>(null);
  const containerId = "yt-trem-bala-player";
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = () => {
      playerRef.current = new window.YT.Player(containerId, {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 0, controls: 0, modestbranding: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(volume);
            setReady(true);
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = init;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && playerRef.current?.setVolume) playerRef.current.setVolume(volume);
  }, [volume, ready]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  return (
    <>
      <div style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: -9999, top: -9999 }}>
        <div id={containerId} />
      </div>
      <div className="fixed bottom-5 right-5 z-50 glass rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
        <button
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Tocar Trem-Bala"}
          className="size-9 rounded-full gradient-rose flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <span className="font-display italic text-xs text-foreground/80 hidden sm:inline whitespace-nowrap">Trem-Bala ❤️</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="w-20 accent-[oklch(0.7_0.22_12)]"
          aria-label="Volume"
        />
      </div>
    </>
  );
}
