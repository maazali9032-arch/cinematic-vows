import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { Corner, Ornament } from "./primitives";
import type { Invitation } from "@/data/invitation";

export function CoupleHero({ data, started }: { data: Invitation; started: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const backgroundSrc = useMemo(() => {
    const extra = data.extra;
    if (extra?.groomPhotoUrl) return extra.groomPhotoUrl;
    if (extra?.bridePhotoUrl) return extra.bridePhotoUrl;
    if (data.venue?.imageUrl) return data.venue.imageUrl;
    if (data.gallery && data.gallery.length > 0 && data.gallery[0]) {
      return data.gallery[0].src;
    }
    return heroBg;
  }, [data]);

  const base = started ? 0.35 : 0;
  const step = (i: number) => ({
    initial: { opacity: 0, y: reduced ? 0 : 22, filter: "blur(8px)" },
    animate: started ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: {
      duration: reduced ? 0.4 : 1.5,
      delay: base + i * 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  const groomName = data.groomName;
  const brideName = data.brideName;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-[max(3rem,env(safe-area-inset-top))]"
      aria-label="Wedding invitation opening"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src={backgroundSrc}
          alt=""
          width={1024}
          height={1536}
          className="size-full scale-110 object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--ink)_88%)]" />
      </motion.div>

      <Corner className="pointer-events-none absolute left-4 top-6 sm:left-8 sm:top-10" />
      <Corner className="pointer-events-none absolute right-4 top-6 scale-x-[-1] sm:right-8 sm:top-10" />
      <Corner className="pointer-events-none absolute bottom-6 left-4 scale-y-[-1] sm:bottom-10 sm:left-8" />
      <Corner className="pointer-events-none absolute bottom-6 right-4 scale-[-1] sm:bottom-10 sm:right-8" />

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-xl text-center">
        {data.invocation && (
          <motion.div {...step(0)} className="mb-10">
            <p dir="auto" className="font-arabic text-2xl leading-[1.9] text-gold-soft sm:text-3xl">
              {data.invocation}
            </p>
          </motion.div>
        )}

        <motion.div {...step(1)} className="mb-9 flex justify-center">
          <Ornament />
        </motion.div>

        {(groomName || brideName) && (
          <motion.h1 className="font-display font-light leading-[0.95] text-ivory">
            {groomName && (
              <motion.span
                {...step(2)}
                className="block text-[3.1rem] uppercase tracking-[0.06em] sm:text-7xl"
              >
                {groomName}
              </motion.span>
            )}
            {groomName && brideName && (
              <motion.span
                {...step(3)}
                className="my-3 block text-3xl italic text-gold sm:my-4 sm:text-4xl"
              >
                &amp;
              </motion.span>
            )}
            {brideName && (
              <motion.span
                {...step(4)}
                className="block text-[3.1rem] uppercase tracking-[0.06em] sm:text-7xl"
              >
                {brideName}
              </motion.span>
            )}
          </motion.h1>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ delay: base + 4.4, duration: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <span className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-gold/70">
          Scroll
        </span>
        <div className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </motion.div>
    </section>
  );
}
