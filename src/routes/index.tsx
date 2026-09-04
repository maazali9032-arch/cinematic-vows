import { createFileRoute } from "@tanstack/react-router";
import { Corner, Eyebrow, Ornament, Reveal } from "@/components/invitation/primitives";

const title = "Cinematic Vows — Design 02";
const description =
  "Cinematic, single-page digital wedding invitations. Enter an invitation slug to view.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootLanding,
});

function RootLanding() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <section className="relative flex min-h-[100svh] items-center justify-center px-6 py-[max(3rem,env(safe-area-inset-top))]">
        <Corner className="pointer-events-none absolute left-4 top-6 sm:left-8 sm:top-10" />
        <Corner className="pointer-events-none absolute right-4 top-6 scale-x-[-1] sm:right-8 sm:top-10" />
        <Corner className="pointer-events-none absolute bottom-6 left-4 scale-y-[-1] sm:bottom-10 sm:left-8" />
        <Corner className="pointer-events-none absolute bottom-6 right-4 scale-[-1] sm:bottom-10 sm:right-8" />

        <div className="mx-auto w-full max-w-lg text-center">
          <Reveal className="flex justify-center">
            <Ornament className="w-52 opacity-80" />
          </Reveal>

          <Reveal delay={0.12}>
            <Eyebrow className="mt-10">Design 02</Eyebrow>
          </Reveal>

          <Reveal delay={0.22}>
            <h1 className="mt-8 font-display text-[2.9rem] font-light leading-[1.05] text-ivory sm:text-6xl">
              Cinematic
              <span className="mx-3 italic text-gold">&amp;</span>
              Vows
            </h1>
          </Reveal>

          <Reveal delay={0.34}>
            <p className="mt-8 font-display text-lg italic leading-relaxed text-muted-foreground sm:text-xl">
              A premium digital wedding invitation experience.
              <br />
              Share a link. Tell a story. Begin forever.
            </p>
          </Reveal>

          <Reveal delay={0.46}>
            <p className="mt-12 font-sans text-[0.58rem] uppercase tracking-[0.3em] text-gold/75">
              Invitations are accessed via your personal link.
            </p>
          </Reveal>

          <Reveal delay={0.58} className="mt-16 flex justify-center">
            <Ornament className="w-44 opacity-60" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
