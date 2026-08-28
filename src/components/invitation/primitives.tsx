import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.3 : 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-sans text-[0.6rem] uppercase tracking-wide-xl text-gold/80 sm:text-[0.68rem]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("hairline w-full", className)} />;
}

export function Diamond({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 rotate-45 border border-gold/70", className)}
    />
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 40"
      className={cn("h-8 w-52 text-gold", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    >
      <path d="M2 20h78" opacity="0.5" />
      <path d="M160 20h78" opacity="0.5" />
      <path d="M120 6c-9 6-14 10-14 14s5 8 14 14c9-6 14-10 14-14s-5-8-14-14z" />
      <path d="M120 12c-5 4-8 6-8 8s3 4 8 8c5-4 8-6 8-8s-3-4-8-8z" opacity="0.7" />
      <path d="M92 20c4-5 8-5 12 0-4 5-8 5-12 0z" opacity="0.8" />
      <path d="M136 20c4-5 8-5 12 0-4 5-8 5-12 0z" opacity="0.8" />
      <circle cx="86" cy="20" r="1.4" />
      <circle cx="154" cy="20" r="1.4" />
    </svg>
  );
}

export function Corner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 80"
      className={cn("size-16 text-gold/45", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
    >
      <path d="M2 30V2h28" />
      <path d="M2 44V10c0-4 4-8 8-8h34" opacity="0.6" />
      <path d="M10 22c8-2 12 2 14 10 2-8 6-12 14-10" opacity="0.8" />
      <circle cx="24" cy="24" r="1.3" />
    </svg>
  );
}
