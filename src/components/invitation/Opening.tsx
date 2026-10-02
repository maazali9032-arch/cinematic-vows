import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Ornament } from "./primitives";
import type { Invitation } from "@/data/invitation";

export function Opening({
  data,
  open,
  onOpen,
}: {
  data: Invitation;
  open: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-ink px-6 py-[max(2rem,env(safe-area-inset-top))] text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="my-auto flex w-full max-w-xl shrink-0 flex-col items-center gap-8"
          >
            <Ornament className="w-40 opacity-80" />
            <p className="font-sans text-[0.6rem] uppercase tracking-wide-xl text-gold/70">
              You are invited
            </p>
            <h1 className="w-full font-display text-[clamp(1.8rem,9.3vw,2.25rem)] font-light leading-[1.05] text-ivory sm:text-5xl">
              {data.groomName && <span className="block break-words">{data.groomName}</span>}
              {data.groomName && data.brideName && (
                <span className="my-3 block italic text-gold">&amp;</span>
              )}
              {data.brideName && <span className="block break-words">{data.brideName}</span>}
            </h1>
            <button
              onClick={onOpen}
              className="group relative mt-2 border border-gold/50 px-8 py-3.5 font-sans text-[0.65rem] uppercase tracking-[0.34em] text-gold transition-colors duration-500 hover:bg-gold/10"
            >
              Open Invitation
            </button>
            {data.music.enabled && data.music.src && (
              <p className="max-w-xs font-sans text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground/70">
                Best experienced with sound
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
