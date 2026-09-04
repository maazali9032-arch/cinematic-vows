import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Invitation } from "@/data/invitation";
import { fetchPublicInvitation, type PublicInvitationResult } from "@/lib/public-invitation";
import { UnavailableFallback } from "@/components/invitation/UnavailableFallback";
import { Opening } from "@/components/invitation/Opening";
import { CoupleHero } from "@/components/invitation/CoupleHero";
import { Countdown } from "@/components/invitation/Countdown";
import { MusicControl } from "@/components/invitation/MusicControl";
import { Closing, Events, Gallery, Venue } from "@/components/invitation/Sections";
import { createAmbience, type Ambience } from "@/lib/create-ambience";

export const Route = createFileRoute("/$slug")({
  head: () => ({ meta: [{ title: "Cinematic Vows — Wedding Invitation" }] }),
  component: SlugInvitationPage,
});

function sanitizeSlug(value: string): string | null {
  try {
    const slug = decodeURIComponent(value).trim();
    return slug && !/[\\/]/.test(slug) ? slug : null;
  } catch {
    return null;
  }
}

function SlugInvitationPage() {
  const { slug: rawSlug } = Route.useParams();
  const slug = sanitizeSlug(rawSlug);
  const [result, setResult] = useState<PublicInvitationResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    if (!slug) {
      setResult({ state: "not_found" });
      return;
    }
    void fetchPublicInvitation(slug).then((next) => {
      if (!cancelled) setResult(next);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!result)
    return (
      <PageStatus
        title="Loading your invitation"
        detail="Just a moment while we prepare the details."
      />
    );

  if (result.state !== "live") {
    return (
      <UnavailableFallback
        status={
          result.state === "fallback"
            ? "draft"
            : result.state === "not_found"
              ? "invalid"
              : "request_error"
        }
        shop={
          result.state === "fallback"
            ? result.shop
            : { name: null, location: null, contact: null, locationUrl: null }
        }
        currentDate={new Date()}
      />
    );
  }

  return <InvitationRender invitation={result.invitation} />;
}

function PageStatus({ title, detail }: { title: string; detail: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-4xl text-ivory">{title}</h1>
        <p className="mt-4 font-display italic text-muted-foreground">{detail}</p>
      </div>
    </main>
  );
}

function InvitationRender({ invitation: data }: { invitation: Invitation }) {
  const [opened, setOpened] = useState(false);
  const [ambienceAvailable, setAmbienceAvailable] = useState(false);
  const [ambiencePlaying, setAmbiencePlaying] = useState(false);
  const ambienceRef = useRef<Ambience | null>(null);
  const coupleNames = `${data.groomName} & ${data.brideName}`;

  useEffect(() => () => ambienceRef.current?.dispose(), []);

  const openInvitation = () => {
    // This runs in the button's click handler, preserving the browser's user gesture.
    const ambience = ambienceRef.current ?? createAmbience();
    ambienceRef.current = ambience;
    setOpened(true);
    void ambience?.start().then((didStart) => {
      setAmbienceAvailable(didStart);
      setAmbiencePlaying(didStart);
    });
  };

  const toggleAmbience = () => {
    const ambience = ambienceRef.current;
    if (!ambience) return;
    if (ambiencePlaying) {
      ambience.stop();
      setAmbiencePlaying(false);
    } else {
      void ambience.start().then((didStart) => {
        setAmbienceAvailable(didStart);
        setAmbiencePlaying(didStart);
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Opening data={data} open={opened} onOpen={openInvitation} />
      <div aria-hidden={!opened}>
        <CoupleHero data={data} started={opened} />
        {data.weddingDateISO && <Countdown dateISO={data.weddingDateISO} names={coupleNames} />}
        <Events events={data.events} />
        <Venue venue={data.venue} />
        <Gallery images={data.gallery} />
        <Closing data={data} />
      </div>
      <MusicControl
        started={opened}
        playing={ambiencePlaying}
        available={ambienceAvailable}
        onToggle={toggleAmbience}
        label="Ambient invitation music"
      />
    </main>
  );
}
