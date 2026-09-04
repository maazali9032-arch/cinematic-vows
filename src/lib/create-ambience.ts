/** A clean HTML5 streaming audio wrapper for background music loops. */
export type Ambience = {
  start: () => Promise<boolean>;
  stop: () => void;
  dispose: () => void;
};

export function createAmbience(): Ambience | null {
  if (typeof window === "undefined") return null;

  try {
    // Points directly to public/leberch-romantic-584475.mp3 automatically
    const audio = new Audio("/leberch-romantic-584475.mp3");
    audio.loop = true;
    
    // Balanced volume: clean and audible without over-powering your invitation text
    audio.volume = 0.40; 

    return {
      async start() {
        try {
          await audio.play();
          return true;
        } catch (error) {
          console.warn("Audio playback blocked by standard browser policy:", error);
          return false;
        }
      },
      stop() {
        audio.pause();
      },
      dispose() {
        audio.pause();
        audio.src = ""; // Clears the file stream cleanly from device memory
      }
    };
  } catch {
    return null;
  }
}
