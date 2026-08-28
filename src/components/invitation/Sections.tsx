import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, MessageCircle, Phone, X } from "lucide-react";
import { Diamond, Eyebrow, Ornament, Reveal, Rule } from "./primitives";
import type { GalleryImage, Invitation, WeddingEvent } from "@/data/invitation";

export function Intro({ data }: { data: Invitation }) {
  const intro = data.intro;
  return (
    <section className="relative px-6 py-24 sm:py-36" aria-label="Wedding message">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>{intro.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 font-display text-2xl font-light leading-[1.7] text-ivory sm:text-[2rem] sm:leading-[1.6]">
            {intro.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex justify-center">
          <Diamond />
        </Reveal>
        <Reveal delay={0.4}>
          <blockquote className="mt-12 font-display text-base italic leading-[1.9] text-muted-foreground sm:text-lg">
            {intro.verse}
            <footer className="mt-5 font-sans text-[0.55rem] uppercase not-italic tracking-[0.28em] text-gold/80">
              {intro.verseSource}
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function EventItem({ event, index }: { event: WeddingEvent; index: number }) {
  return (
    <Reveal delay={index * 0.08} className="relative">
      <article className="border-t border-gold/20 px-1 py-14 text-center first:border-t-0 sm:py-16">
        <h3 className="font-display text-[2.1rem] uppercase tracking-[0.18em] text-gold sm:text-5xl">
          {event.name}
        </h3>
        <div className="mx-auto mt-7 flex max-w-xs items-center gap-4">
          <Rule />
          <Diamond className="shrink-0" />
          <Rule />
        </div>
        <p className="mt-7 font-display text-xl text-ivory sm:text-2xl">{event.date}</p>
        <p className="mt-2 font-sans text-[0.62rem] uppercase tracking-[0.3em] text-gold/80">
          {event.time}
        </p>
        <p className="mt-6 font-display text-lg italic text-ivory/90">{event.venue}</p>
        <p className="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
          {event.address} · {event.city}
        </p>
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-8 inline-flex items-center gap-2 border border-gold/40 px-6 py-3 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-gold transition-colors duration-500 hover:bg-gold/10"
        >
          <MapPin className="size-3.5" aria-hidden />
          View location
        </a>
      </article>
    </Reveal>
  );
}

export function Events({ events }: { events: WeddingEvent[] }) {
  return (
    <section className="relative px-6 py-20 sm:py-28" aria-label="Wedding events">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>The celebrations</Eyebrow>
          <div className="mt-6 flex justify-center">
            <Ornament className="w-44 opacity-70" />
          </div>
        </Reveal>
        <div className="mt-8">
          {events.map((event, i) => (
            <EventItem key={event.name} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Venue({ venue }: { venue: Invitation["venue"] }) {
  return (
    <section className="relative px-6 py-24 sm:py-32" aria-label="Venue">
      <div className="mx-auto max-w-xl border border-gold/25 px-6 py-14 text-center sm:px-12 sm:py-16">
        <Reveal>
          <Eyebrow>The venue</Eyebrow>
          <h2 className="mt-7 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl">
            {venue.name}
          </h2>
          <p className="mt-5 font-display text-lg italic text-muted-foreground">{venue.address}</p>
          <p className="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            {venue.city}
          </p>
          <p className="mt-4 font-sans text-[0.58rem] uppercase tracking-[0.24em] text-gold/75">
            {venue.landmark}
          </p>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-10 inline-flex items-center gap-2 border border-gold/50 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold/10"
          >
            <MapPin className="size-3.5" aria-hidden />
            Get directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ParallaxImage({
  image,
  className,
  range = 40,
  onOpen,
}: {
  image: GalleryImage;
  className?: string;
  range?: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <button
      ref={ref}
      onClick={onOpen}
      className={`group relative block overflow-hidden ${className ?? ""}`}
      aria-label={`Open image: ${image.alt}`}
    >
      <motion.img
        style={{ y }}
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="size-full scale-[1.14] object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.2]"
      />
      <span className="pointer-events-none absolute inset-0 border border-gold/20" />
    </button>
  );
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  const [first, second, third] = images;
  if (!first || !second || !third) return null;


  return (
    <section className="relative px-5 py-20 sm:py-28" aria-label="Photo gallery">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <Eyebrow>Moments</Eyebrow>
        </Reveal>

        <div className="mt-12 space-y-6 sm:space-y-10">
          <Reveal>
            <ParallaxImage
              image={first}
              onOpen={() => setActive(first)}
              className="mx-auto aspect-[3/4] w-full max-w-md"
            />
          </Reveal>
          <div className="grid grid-cols-5 items-end gap-4 sm:gap-8">
            <Reveal delay={0.1} className="col-span-3">
              <ParallaxImage
                image={second}
                range={28}
                onOpen={() => setActive(second)}
                className="aspect-[3/4] w-full"
              />
            </Reveal>
            <Reveal delay={0.22} className="col-span-2 pb-10">
              <p className="font-display text-lg italic leading-relaxed text-muted-foreground sm:text-2xl">
                Every ritual, a memory in the making.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ParallaxImage
              image={third}
              range={26}
              onOpen={() => setActive(third)}
              className="aspect-[16/10] w-full"
            />
          </Reveal>
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-5 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 grid size-10 place-items-center border border-gold/40 text-gold"
          >
            <X className="size-4" />
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            src={active.src}
            alt={active.alt}
            className="max-h-[85svh] w-auto max-w-full object-contain"
          />
        </div>
      )}
    </section>
  );
}

export function Closing({ data }: { data: Invitation }) {
  const { closing, contact } = data;
  return (
    <section className="relative px-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-24 text-center sm:pt-32">
      <div className="mx-auto max-w-xl">
        <Reveal>
          <Eyebrow>{closing.kicker}</Eyebrow>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-8 font-display text-4xl font-light uppercase leading-tight tracking-[0.08em] text-ivory sm:text-6xl">
            {data.groomName}
            <span className="mx-3 italic text-gold">&amp;</span>
            {data.brideName}
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-8 font-display text-xl italic leading-[1.8] text-muted-foreground sm:text-2xl">
            {closing.message.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                "We would love to attend your wedding!",
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-full items-center justify-center gap-2 border border-gold/50 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold/10 sm:w-auto"
            >
              <MessageCircle className="size-3.5" aria-hidden />
              RSVP on WhatsApp
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex w-full items-center justify-center gap-2 border border-gold/25 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-ivory/80 transition-colors duration-500 hover:border-gold/50 sm:w-auto"
            >
              <Phone className="size-3.5" aria-hidden />
              Call us
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.5} className="mt-16 flex justify-center">
          <Ornament className="w-48 opacity-70" />
        </Reveal>
        <Reveal delay={0.6}>
          <p className="mt-8 font-sans text-[0.55rem] uppercase tracking-wide-xl text-gold/60">
            {data.hashtag}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
