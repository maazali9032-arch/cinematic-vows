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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8"
          >
            <Ornament className="w-40 opacity-80" />
            <p className="font-sans text-[0.6rem] uppercase tracking-wide-xl text-gold/70">
              You are invited
            </p>
            <h1 className="font-display text-4xl font-light leading-[1.05] text-ivory sm:text-5xl">
              {[data.groomName, data.brideName].filter(Boolean).join(" & ")}
            </h1>
            <button
              onClick={onOpen}
              className="group relative mt-2 border border-gold/50 px-8 py-3.5 font-sans text-[0.65rem] uppercase tracking-[0.34em] text-gold transition-colors duration-500 hover:bg-gold/10"
            >
              Open Invitation
            </button>
            <p className="max-w-xs font-sans text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground/70">
              Best experienced with sound
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
