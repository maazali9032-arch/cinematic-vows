import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { Eyebrow, Ornament, Reveal } from "./primitives";

export function RSVP({
  deadline,
  coupleNames,
}: {
  deadline: string | null;
  coupleNames: string;
}) {
  const [response, setResponse] = useState<"accept" | "decline" | null>(null);
  const reduced = useReducedMotion();

  return (
    <section className="relative px-6 py-24 sm:py-32" aria-label="RSVP">
      <div className="mx-auto max-w-xl text-center">
        <Reveal className="flex justify-center">
          <Ornament className="w-44 opacity-70" />
        </Reveal>
        <Reveal delay={0.08}>
          <Eyebrow className="mt-8">Will you join us?</Eyebrow>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-8 font-display text-xl italic leading-relaxed text-muted-foreground sm:text-2xl">
            The honour of your presence is requested as we begin this new chapter together.
            {deadline && (
              <span className="mt-4 block font-sans text-[0.58rem] uppercase tracking-[0.28em] text-gold/75">
                Kindly RSVP by {deadline}
              </span>
            )}
          </p>
        </Reveal>

        <AnimatePresence mode="wait">
          {!response ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: reduced ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -14 }}
              transition={{ delay: 0.3, duration: reduced ? 0.3 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <button
                type="button"
                onClick={() => setResponse("accept")}
                className="inline-flex w-full items-center justify-center gap-2 border border-gold/60 px-8 py-4 font-sans text-[0.6rem] uppercase tracking-[0.32em] text-gold transition-all duration-500 hover:bg-gold/10 hover:border-gold sm:w-auto"
              >
                <Check className="size-3.5" aria-hidden />
                Will Be There
              </button>
              <button
                type="button"
                onClick={() => setResponse("decline")}
                className="inline-flex w-full items-center justify-center gap-2 border border-gold/25 px-8 py-4 font-sans text-[0.6rem] uppercase tracking-[0.32em] text-ivory/80 transition-all duration-500 hover:border-gold/60 hover:text-gold sm:w-auto"
              >
                <X className="size-3.5" aria-hidden />
                Regretfully Decline
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={response}
              initial={{ opacity: 0, y: reduced ? 0 : 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduced ? 0.3 : 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 border border-gold/30 px-6 py-12 sm:px-12 sm:py-14"
            >
              {response === "accept" ? (
                <>
                  <div className="mx-auto grid size-14 place-items-center rounded-full border border-gold/60 text-gold">
                    <Check className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-light text-ivory sm:text-4xl">
                    Thank you
                  </h3>
                  <p className="mt-4 font-display text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
                    Your presence will make our day complete.
                    <br />
                    We look forward to celebrating with you.
                  </p>
                  <p className="mt-8 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-gold/75">
                    With love, {coupleNames}
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto grid size-14 place-items-center rounded-full border border-gold/40 text-gold/80">
                    <X className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-light text-ivory sm:text-4xl">
                    You will be missed
                  </h3>
                  <p className="mt-4 font-display text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
                    Though we wish you could be there,
                    <br />
                    your warm thoughts mean the world to us.
                  </p>
                  <p className="mt-8 font-sans text-[0.55rem] uppercase tracking-[0.3em] text-gold/75">
                    With love, {coupleNames}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
