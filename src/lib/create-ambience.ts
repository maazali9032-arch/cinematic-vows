/** A clean HTML5 streaming audio wrapper for background music loops. */
export type Ambience = {
  start: () => Promise<boolean>;
  stop: () => void;
  dispose: () => void;
};

export function createAmbience(src: string): Ambience | null {
  if (!src || typeof window === "undefined") return null;

  try {
    // Only the public RPC-provided music URL is used.
    const audio = new Audio(src);
    audio.loop = true;

    // Balanced volume: clean and audible without over-powering your invitation text
    audio.volume = 0.4;

    return {
      async start() {
        try {
          await audio.play();
          return true;
        } catch {
          return false;
        }
      },
      stop() {
        audio.pause();
      },
      dispose() {
        audio.pause();
        audio.src = ""; // Clears the file stream cleanly from device memory
      },
    };
  } catch {
    return null;
  }
}
