import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Eyebrow, Ornament, Reveal } from "./primitives";

function diff(target: number) {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  return {
    Days: Math.floor(ms / 86400000),
    Hours: Math.floor(ms / 3600000) % 24,
    Minutes: Math.floor(ms / 60000) % 60,
    Seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ dateISO, names }: { dateISO: string; names: string }) {
  const target = new Date(dateISO).getTime();
  const [time, setTime] = useState<ReturnType<typeof diff>>(null);

  useEffect(() => {
    setTime(diff(target));
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section className="relative px-6 py-24 sm:py-32" aria-label="Countdown to the wedding day">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>Counting the days</Eyebrow>
        </Reveal>

        {time ? (
          <div className="mt-10 grid grid-cols-4 gap-px overflow-hidden border-y border-gold/25 bg-gold/15">
            {Object.entries(time).map(([label, value], i) => (
              <Reveal key={label} delay={i * 0.1} className="bg-background">
                <div className="px-1 py-7 sm:py-10">
                  <motion.span
                    key={value}
                    initial={{ opacity: 0.2, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="block font-display text-3xl font-light tabular-nums text-ivory sm:text-5xl"
                  >
                    {String(value).padStart(2, "0")}
                  </motion.span>
                  <span className="mt-2 block font-sans text-[0.5rem] uppercase tracking-[0.24em] text-gold/75 sm:text-[0.6rem]">
                    {label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal delay={0.1}>
            <p className="mt-10 font-display text-2xl italic text-ivory sm:text-3xl">
              {names} are married.
            </p>
            <p className="mt-3 font-sans text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
              Thank you for celebrating with us
            </p>
          </Reveal>
        )}

        <Reveal delay={0.3} className="mt-10 flex justify-center">
          <Ornament className="w-40 opacity-70" />
        </Reveal>
      </div>
    </section>
  );
}
