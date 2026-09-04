import type { LifecycleStatus, ShopInfo } from "@/lib/invitation-mapper";
import { Corner, Eyebrow, Ornament, Reveal } from "./primitives";

const STATUS_TEXT: Record<LifecycleStatus, { title: string; detail: string }> = {
  active: { title: "Unavailable", detail: "This invitation is not currently available." },
  invalid: {
    title: "Invitation not found",
    detail: "We couldn't locate this invitation. Please check the link or contact us.",
  },
  draft: {
    title: "Invitation coming soon",
    detail: "This invitation is being prepared and will be available shortly.",
  },
  archived: {
    title: "Invitation archived",
    detail: "This invitation has been gently closed and is no longer on display.",
  },
  not_yet_active: {
    title: "Invitation coming soon",
    detail: "This invitation will be unveiled at the scheduled date. Please check back.",
  },
  expired: {
    title: "Invitation period has closed",
    detail: "This invitation window has come to a close. Thank you for being part of our journey.",
  },
};

export function UnavailableFallback({
  status,
  shop,
  currentDate,
}: {
  status: LifecycleStatus;
  shop: ShopInfo;
  currentDate: Date;
}) {
  const text = STATUS_TEXT[status] ?? STATUS_TEXT.invalid;
  const dateStr = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <section className="relative flex min-h-[100svh] items-center justify-center px-6 py-[max(3rem,env(safe-area-inset-top))]">
        <Corner className="pointer-events-none absolute left-4 top-6 sm:left-8 sm:top-10" />
        <Corner className="pointer-events-none absolute right-4 top-6 scale-x-[-1] sm:right-8 sm:top-10" />
        <Corner className="pointer-events-none absolute bottom-6 left-4 scale-y-[-1] sm:bottom-10 sm:left-8" />
        <Corner className="pointer-events-none absolute bottom-6 right-4 scale-[-1] sm:bottom-10 sm:right-8" />

        <div className="mx-auto w-full max-w-lg text-center">
          <Reveal className="flex justify-center">
            <Ornament className="w-48 opacity-80" />
          </Reveal>

          <Reveal delay={0.1}>
            <Eyebrow className="mt-10">{dateStr}</Eyebrow>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="mt-8 font-display text-4xl font-light leading-tight text-ivory sm:text-5xl">
              {text.title}
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="mt-6 font-display text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
              {text.detail}
            </p>
          </Reveal>

          {(shop.name || shop.location || shop.contact) && (
            <Reveal delay={0.42}>
              <div className="mx-auto mt-14 max-w-sm border border-gold/25 px-6 py-10 text-center sm:px-10">
                {shop.name && (
                  <p className="font-display text-2xl font-light text-ivory sm:text-3xl">
                    {shop.name}
                  </p>
                )}
                {shop.location && (
                  <p className="mt-4 font-display italic text-muted-foreground">
                    {shop.location}
                  </p>
                )}
                {shop.contact && (
                  <p className="mt-3 font-sans text-[0.6rem] uppercase tracking-[0.28em] text-gold/80">
                    {shop.contact}
                  </p>
                )}
                {shop.locationUrl && (
                  <a
                    href={shop.locationUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-8 inline-flex items-center gap-2 border border-gold/50 px-6 py-3 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold transition-colors duration-500 hover:bg-gold/10"
                  >
                    Visit us
                  </a>
                )}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.55} className="mt-14 flex justify-center">
            <Ornament className="w-44 opacity-70" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
