import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function MusicControl({
  src,
  started,
  enabled = true,
  label,
}: {
  src: string;
  started: boolean;
  enabled?: boolean;
  label?: string | null;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!started || !enabled || !src) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [started, enabled, src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  if (!started || !src || !enabled) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" title={label ?? undefined} />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={label ?? undefined}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid size-11 place-items-center rounded-full border border-gold/40 bg-ink/70 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
}
