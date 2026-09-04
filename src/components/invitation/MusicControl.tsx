import { Pause, Play } from "lucide-react";

export function MusicControl({
  started,
  playing,
  available,
  onToggle,
  label,
}: {
  started: boolean;
  playing: boolean;
  available: boolean;
  onToggle: () => void;
  label?: string | null;
}) {
  if (!started || !available) return null;

  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "Pause ambient music" : "Play ambient music"}
      title={label ?? "Ambient invitation music"}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 grid size-11 place-items-center rounded-full border border-gold/40 bg-ink/70 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
    >
      {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
    </button>
  );
}
