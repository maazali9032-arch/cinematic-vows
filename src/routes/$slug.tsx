import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Invitation } from "@/data/invitation";
import {
  fetchPublicInvitation,
  slugFromPath,
  type PublicInvitationResult,
} from "@/lib/public-invitation";
import { UnavailableFallback } from "@/components/invitation/UnavailableFallback";
import { Opening } from "@/components/invitation/Opening";
import { CoupleHero } from "@/components/invitation/CoupleHero";
import { Countdown } from "@/components/invitation/Countdown";
import { MusicControl } from "@/components/invitation/MusicControl";
import {
  Closing,
  Events,
  Gallery,
  Venue,
  CoupleProfiles,
  RelativesSection,
} from "@/components/invitation/Sections";
import { BrandRibbon } from "@/components/invitation/BrandRibbon";
import { createAmbience, type Ambience } from "@/lib/create-ambience";
import decorativeFrame from "@/assets/decorative-frame.webp";

export const Route = createFileRoute("/$slug")({
  head: () => ({ meta: [{ title: "Cinematic Vows — Wedding Invitation" }] }),
  component: SlugInvitationPage,
});

function SlugInvitationPage() {
  const { slug: rawSlug } = Route.useParams();
  const slug =
    typeof window === "undefined"
      ? null
      : slugFromPath(window.location.pathname);

  const [attempt, setAttempt] = useState(0);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [result, setResult] = useState<PublicInvitationResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    setResult(null);

    if (!slug) {
      setLoadedSlug(null);
      setResult({ state: "not_found" });
      return;
    }

    void fetchPublicInvitation(slug).then((next) => {
      if (!cancelled) {
        setLoadedSlug(slug);
        setResult(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  if (!result || loadedSlug !== slug) {
    return (
      <PageStatus
        title="Loading your invitation"
        detail="Just a moment while we prepare the details."
      />
    );
  }

  if (result.state !== "live") {
    return (
      <UnavailableFallback
        status={
          result.state === "fallback"
            ? "fallback"
            : result.state === "not_found"
              ? "invalid"
              : "request_error"
        }
        shop={
          result.state === "fallback"
            ? result.shop
            : {
                name: null,
                location: null,
                contact: null,
                locationUrl: null,
              }
        }
        onRetry={
          result.state === "request_error"
            ? () => setAttempt((a) => a + 1)
            : undefined
        }
        currentDate={new Date()}
      />
    );
  }

  return (
    <InvitationRender
      key={`${rawSlug}-${attempt}`}
      invitation={result.invitation}
      brandName={result.brandName}
    />
  );
}

function PageStatus({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-4xl text-ivory">{title}</h1>
        <p className="mt-4 font-display italic text-muted-foreground">
          {detail}
        </p>
      </div>
    </main>
  );
}

function InvitationRender({
  invitation: data,
  brandName,
}: {
  invitation: Invitation;
  brandName: string | null;
}) {
  const [opened, setOpened] = useState(false);
  const [ambienceAvailable, setAmbienceAvailable] = useState(false);
  const [ambiencePlaying, setAmbiencePlaying] = useState(false);

  const ambienceRef = useRef<Ambience | null>(null);

  useEffect(() => {
    return () => ambienceRef.current?.dispose();
  }, []);

  useEffect(() => {
    if (opened) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  const openInvitation = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    const ambience =
      ambienceRef.current ??
      (data.music.enabled ? createAmbience(data.music.src) : null);

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

      {/* Permanent decorative frame */}
      <img
        src={decorativeFrame}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 h-screen w-screen object-fill opacity-50"
        // className="pointer-events-none fixed inset-0 z-40 h-screen w-screen object-fill"
      />

      {/* Entire invitation stays above the decorative frame */}
      <div className="relative z-50">
        <Opening
          data={data}
          open={opened}
          onOpen={openInvitation}
        />

        <div aria-hidden={!opened} inert={!opened}>
          <CoupleHero
            data={data}
            started={opened}
          />

          {data.weddingDateISO && (
            <Countdown dateISO={data.weddingDateISO} />
          )}

          <CoupleProfiles
            profiles={data.profiles}
          />

          <RelativesSection
            relatives={data.extra.relatives}
          />

          <Events
            events={data.events}
          />

          <Venue
            venue={data.venue}
          />

          <Gallery
            images={data.gallery}
          />

          <Closing
            data={data}
          />
        </div>
      </div>

      {/* Existing controls */}
      <div className="relative z-[60]">
        <BrandRibbon
          name={brandName}
        />

        <MusicControl
          started={opened}
          playing={ambiencePlaying}
          available={ambienceAvailable}
          onToggle={toggleAmbience}
          label="Ambient invitation music"
        />
      </div>
    </main>
  );
}