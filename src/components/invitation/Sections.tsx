import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Instagram, MapPin, MessageCircle, Phone, X, Youtube } from "lucide-react";
import { Diamond, Eyebrow, Ornament, Reveal, Rule } from "./primitives";
import type {
  GalleryImage,
  Invitation,
  Parent,
  Relative,
  SocialLink,
  WeddingEvent,
} from "@/data/invitation";

export function Intro({ data }: { data: Invitation }) {
  const intro = data.intro;
  const hasLines = intro.lines && intro.lines.length > 0;
  const hasVerse = Boolean(intro.verse);
  if (!hasLines && !hasVerse) return null;

  return (
    <section className="relative px-6 py-24 sm:py-36" aria-label="Wedding message">
      <div className="mx-auto max-w-2xl text-center">
        {intro.eyebrow && (
          <Reveal>
            <Eyebrow>{intro.eyebrow}</Eyebrow>
          </Reveal>
        )}
        {hasLines && (
          <Reveal delay={0.15}>
            <p className="mt-8 font-display text-2xl font-light leading-[1.7] text-ivory sm:text-[2rem] sm:leading-[1.6]">
              {intro.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </Reveal>
        )}
        {hasLines && hasVerse && (
          <Reveal delay={0.3} className="mt-12 flex justify-center">
            <Diamond />
          </Reveal>
        )}
        {hasVerse && (
          <Reveal delay={hasLines ? 0.4 : 0.2}>
            <blockquote className="mt-12 font-display text-base italic leading-[1.9] text-muted-foreground sm:text-lg">
              {intro.verse}
              {intro.verseSource && (
                <footer className="mt-5 font-sans text-[0.55rem] uppercase not-italic tracking-[0.28em] text-gold/80">
                  {intro.verseSource}
                </footer>
              )}
            </blockquote>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function ParentsSection({ parents }: { parents: Parent[] }) {
  if (!parents || parents.length === 0) return null;
  return (
    <section className="relative px-6 py-20 sm:py-28" aria-label="Parents & Family">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal className="flex justify-center">
          <Ornament className="w-44 opacity-70" />
        </Reveal>
        <Reveal delay={0.08}>
          <Eyebrow className="mt-8">With the blessings of</Eyebrow>
        </Reveal>
        <div className="mt-10 space-y-8">
          {parents.map((p, i) => (
            <Reveal key={p.side} delay={0.2 + i * 0.1}>
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.26em] text-gold/70">
                {p.side}
              </p>
              <p className="mt-3 font-display text-xl italic text-ivory sm:text-2xl">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProfileSection({
  education,
  occupation,
}: {
  education: string | null;
  occupation: string | null;
}) {
  if (!education && !occupation) return null;
  return (
    <section className="relative px-6 py-20 sm:py-28" aria-label="Couple profile">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>The couple</Eyebrow>
        </Reveal>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-16">
          {education && (
            <Reveal className="text-center">
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.26em] text-gold/70">
                Education
              </p>
              <p className="mt-4 font-display text-lg italic leading-relaxed text-ivory sm:text-xl">
                {education}
              </p>
            </Reveal>
          )}
          {occupation && (
            <Reveal delay={0.1} className="text-center">
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.26em] text-gold/70">
                Occupation
              </p>
              <p className="mt-4 font-display text-lg italic leading-relaxed text-ivory sm:text-xl">
                {occupation}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

export function RelativesSection({ relatives }: { relatives: Relative[] }) {
  if (!relatives || relatives.length === 0) return null;
  return (
    <section className="relative px-6 py-20 sm:py-28" aria-label="Relatives">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Along with</Eyebrow>
        </Reveal>
        <div className="mt-10 space-y-8">
          {relatives.map((r, i) => (
            <Reveal key={r.label} delay={0.15 + i * 0.08}>
              <p className="font-sans text-[0.58rem] uppercase tracking-[0.26em] text-gold/70">
                {r.label}
              </p>
              <p className="mt-3 font-display text-lg italic text-muted-foreground sm:text-xl">
                {r.names}
              </p>
            </Reveal>
          ))}
        </div>
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
        {event.venue && (
          <p className="mt-6 font-display text-lg italic text-ivory/90">{event.venue}</p>
        )}
        {(event.address || event.city) && (
          <p className="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
            {[event.address, event.city].filter(Boolean).join(" · ")}
          </p>
        )}
        {event.mapsUrl && (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-flex items-center gap-2 border border-gold/40 px-6 py-3 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-gold transition-colors duration-500 hover:bg-gold/10"
          >
            <MapPin className="size-3.5" aria-hidden />
            View location
          </a>
        )}
      </article>
    </Reveal>
  );
}

export function Events({ events }: { events: WeddingEvent[] }) {
  if (!events || events.length === 0) return null;
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
            <EventItem key={`${event.name}-${i}`} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Venue({ venue }: { venue: Invitation["venue"] }) {
  const hasLandmark = Boolean(venue.landmark);
  const hasImage = Boolean(venue.imageUrl);
  return (
    <section className="relative px-6 py-24 sm:py-32" aria-label="Venue">
      <div className="mx-auto max-w-xl">
        {hasImage && (
          <Reveal className="mb-12">
            <div className="overflow-hidden border border-gold/20">
              <img
                src={venue.imageUrl as string}
                alt={venue.name}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          </Reveal>
        )}
        <div className="border border-gold/25 px-6 py-14 text-center sm:px-12 sm:py-16">
          <Reveal>
            <Eyebrow>The venue</Eyebrow>
            <h2 className="mt-7 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl">
              {venue.name}
            </h2>
            {venue.address && (
              <p className="mt-5 font-display text-lg italic text-muted-foreground">
                {venue.address}
              </p>
            )}
            {venue.city && (
              <p className="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                {venue.city}
              </p>
            )}
            {hasLandmark && (
              <p className="mt-4 font-sans text-[0.58rem] uppercase tracking-[0.24em] text-gold/75">
                {venue.landmark}
              </p>
            )}
            {venue.mapsUrl && (
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-10 inline-flex items-center gap-2 border border-gold/50 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold/10"
              >
                <MapPin className="size-3.5" aria-hidden />
                Get directions
              </a>
            )}
          </Reveal>
        </div>
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
  const reduced = useReducedMotion();
  const safeY = reduced ? 0 : y;

  return (
    <button
      ref={ref}
      onClick={onOpen}
      className={`group relative block overflow-hidden ${className ?? ""}`}
      aria-label={`Open image: ${image.alt}`}
    >
      <motion.img
        style={{ y: safeY }}
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

function Lightbox({ active, onClose }: { active: GalleryImage | null; onClose: () => void }) {
  if (!active) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
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
  );
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  const safe = useMemo(() => (Array.isArray(images) ? images.filter((i) => i?.src) : []), [images]);
  if (safe.length === 0) return null;

  const first = safe[0] as GalleryImage;
  const second = safe[1] ?? null;
  const third = safe[2] ?? null;
  const rest = safe.slice(3);

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

          {second && (
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
          )}

          {third && (
            <Reveal delay={0.1}>
              <ParallaxImage
                image={third}
                range={26}
                onOpen={() => setActive(third)}
                className="aspect-[16/10] w-full"
              />
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {rest.map((img, i) => (
                <Reveal key={`${img.src}-${i}`} delay={0.05 * (i + 1)}>
                  <ParallaxImage
                    image={img}
                    range={20}
                    onOpen={() => setActive(img)}
                    className={i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]"}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox active={active} onClose={() => setActive(null)} />
    </section>
  );
}

export function MemoriesSection({ memories }: { memories: GalleryImage[] }) {
  if (!memories || memories.length === 0) return null;
  const [active, setActive] = useState<GalleryImage | null>(null);
  return (
    <section className="relative px-5 py-20 sm:py-28" aria-label="Memories gallery">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <Eyebrow>Memories</Eyebrow>
          <div className="mt-6 flex justify-center">
            <Ornament className="w-44 opacity-70" />
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {memories.map((img, i) => (
            <Reveal key={`m-${img.src}-${i}`} delay={0.05 * i}>
              <ParallaxImage
                image={img}
                range={16}
                onOpen={() => setActive(img)}
                className={i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}
              />
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox active={active} onClose={() => setActive(null)} />
    </section>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  const i = (icon ?? "").toLowerCase();
  if (i.includes("instagram")) return <Instagram className="size-3.5" aria-hidden />;
  if (i.includes("youtube")) return <Youtube className="size-3.5" aria-hidden />;
  if (i.includes("whatsapp")) return <MessageCircle className="size-3.5" aria-hidden />;
  if (i.includes("phone")) return <Phone className="size-3.5" aria-hidden />;
  return <MessageCircle className="size-3.5" aria-hidden />;
}

export function SocialLinksSection({ links }: { links: SocialLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <section className="relative px-6 py-20 sm:py-28" aria-label="Social & Contact links">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <Eyebrow>Stay connected</Eyebrow>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((l, i) => {
            const url = l.url ?? "#";
            const label = l.label ?? "Connect";
            return (
              <a
                key={`${url}-${i}`}
                href={
                  url.startsWith("http") || url.startsWith("tel:") || url.startsWith("mailto:")
                    ? url
                    : `https://${url}`
                }
                target={url.startsWith("tel:") || url.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  url.startsWith("tel:") || url.startsWith("mailto:")
                    ? undefined
                    : "noreferrer noopener"
                }
                className="inline-flex items-center gap-2 border border-gold/40 px-5 py-3 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-gold transition-colors duration-500 hover:bg-gold/10"
              >
                <SocialIcon icon={l.icon ?? l.label ?? ""} />
                {label}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

export function Closing({ data }: { data: Invitation }) {
  const contacts = data.contacts;

  return (
    <section
      className="relative px-6 pb-[max(4rem,env(safe-area-inset-bottom))] pt-24 text-center sm:pt-32"
      aria-label="Final message"
    >
      <div className="mx-auto max-w-xl">
        <Reveal>
          <Eyebrow>With love</Eyebrow>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-8 font-display text-4xl font-light uppercase leading-tight tracking-[0.08em] text-ivory sm:text-6xl">
            {[data.groomName, data.brideName].filter(Boolean).join(" & ")}
          </h2>
        </Reveal>
        {contacts.length > 0 && (
          <Reveal delay={0.42}>
            <div className="mt-12 space-y-6">
              {contacts.map((contact) => (
                <div key={contact.phone}>
                  <p className="mb-3 font-display italic text-ivory">{contact.name}</p>
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex w-full items-center justify-center gap-2 border border-gold/25 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-ivory/80 sm:w-auto"
                    >
                      <Phone className="size-3.5" aria-hidden />
                      Call
                    </a>
                    <a
                      href={
                        contact.whatsappUrl ??
                        `https://wa.me/${contact.phone.replace(/[^\d]/g, "")}`
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex w-full items-center justify-center gap-2 border border-gold/50 px-7 py-3.5 font-sans text-[0.6rem] uppercase tracking-[0.3em] text-gold sm:w-auto"
                    >
                      <MessageCircle className="size-3.5" aria-hidden />
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.6} className="mt-16 flex justify-center">
          <Ornament className="w-48 opacity-70" />
        </Reveal>
        <Reveal delay={0.68}>
          <p className="mt-8 font-sans text-[0.55rem] uppercase tracking-wide-xl text-gold/60">
            Wedding invitation
          </p>
        </Reveal>
      </div>
    </section>
  );
}
