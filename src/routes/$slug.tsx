import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Invitation } from "@/data/invitation";
import { fetchPublicInvitation, type PublicInvitationResult } from "@/lib/public-invitation";
import { UnavailableFallback } from "@/components/invitation/UnavailableFallback";
import { Opening } from "@/components/invitation/Opening";
import { CoupleHero } from "@/components/invitation/CoupleHero";
import { Countdown } from "@/components/invitation/Countdown";
import { MusicControl } from "@/components/invitation/MusicControl";
import {
  Closing,
  Events,
  Gallery,
  Intro,
  MemoriesSection,
  ParentsSection,
  ProfileSection,
  RelativesSection,
  SocialLinksSection,
  Venue,
} from "@/components/invitation/Sections";
import { RSVP } from "@/components/invitation/RSVP";

export const Route = createFileRoute("/$slug")({
  head: () => ({ meta: [{ title: "Cinematic Vows — Wedding Invitation" }] }),
  component: SlugInvitationPage,
});

function usePublicUrl(slug: string): string {
  const [url, setUrl] = useState<string>(() => {
    if (typeof window === "undefined") return `http://localhost:5173/${slug}`;
    return `${window.location.origin}/${slug}`;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/${slug}`);
    }
  }, [slug]);
  return url;
}

function SlugInvitationPage() {
  const { slug: rawSlug } = Route.useParams();
  const slug = rawSlug.trim();
  const qrUrl = usePublicUrl(slug);
  const [result, setResult] = useState<PublicInvitationResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResult(null);
    void fetchPublicInvitation(slug).then((next) => { if (!cancelled) setResult(next); });
    return () => { cancelled = true; };
  }, [slug]);

  if (!result) return <PageStatus title="Loading your invitation" detail="Just a moment while we prepare the details." />;

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
        shop={result.shop}
        currentDate={new Date()}
      />
    );
  }

  return <InvitationRender invitation={result.invitation} qrUrl={qrUrl} />;
}

function PageStatus({ title, detail }: { title: string; detail: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center"><div><h1 className="font-display text-4xl text-ivory">{title}</h1><p className="mt-4 font-display italic text-muted-foreground">{detail}</p></div></main>;
}

function InvitationRender({
  invitation: data,
  qrUrl,
}: {
  invitation: Invitation;
  qrUrl: string;
}) {
  const [opened, setOpened] = useState(false);
  const coupleNames = `${data.groomName} & ${data.brideName}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Opening data={data} open={opened} onOpen={() => setOpened(true)} />
      <div aria-hidden={!opened}>
        <CoupleHero data={data} started={opened} />
        <Intro data={data} />
        <ParentsSection parents={data.extra?.parents ?? []} />
        <ProfileSection
          education={data.extra?.education ?? null}
          occupation={data.extra?.occupation ?? null}
        />
        <RelativesSection relatives={data.extra?.relatives ?? []} />
        <Countdown dateISO={data.weddingDateISO} names={coupleNames} />
        <Events events={data.events} />
        <Venue venue={data.venue} />
        <Gallery images={data.gallery} />
        <MemoriesSection memories={data.extra?.memories ?? []} />
        <SocialLinksSection links={data.extra?.social ?? []} />
        <RSVP deadline={data.rsvp?.deadline ?? null} coupleNames={coupleNames} />
        <Closing data={data} qrUrl={qrUrl} />
      </div>
      <MusicControl
        src={data.music.src}
        started={opened}
        enabled={data.music.enabled}
        label={data.music.title}
      />
    </main>
  );
}
