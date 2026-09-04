import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchInvitationBySlug } from "@/lib/supabase.server";
import { checkLifecycle, type LifecycleStatus, type ShopInfo } from "@/lib/invitation-mapper";
import type { Invitation } from "@/data/invitation";
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

type LoaderData = {
  lifecycle: LifecycleStatus;
  shop: ShopInfo;
  invitation: Invitation | null;
  currentDateISO: string;
  slug: string;
};

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    const slug = params.slug?.trim() ?? "";
    const row = slug ? await fetchInvitationBySlug(slug) : null;
    const { status, shop, invitation } = checkLifecycle(row);
    return {
      lifecycle: status,
      shop,
      invitation,
      currentDateISO: new Date().toISOString(),
      slug,
    };
  },
  head: ({ loaderData }) => {
    const { invitation, lifecycle, slug } = loaderData ?? {};
    if (!invitation || lifecycle !== "active") {
      const title = "Cinematic Vows — Wedding Invitation";
      const description = "An elegant wedding invitation experience.";
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${invitation.groomName} & ${invitation.brideName} — Wedding Invitation`;
    const description = `Join ${invitation.groomName} and ${invitation.brideName} in ${invitation.venue.city} as they celebrate their union.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/${slug ?? ""}` },
      ],
    };
  },
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
  const { lifecycle, shop, invitation, currentDateISO, slug } = Route.useLoaderData();
  const qrUrl = usePublicUrl(slug);

  if (!invitation || lifecycle !== "active") {
    return (
      <UnavailableFallback
        status={lifecycle}
        shop={shop}
        currentDate={new Date(currentDateISO)}
      />
    );
  }

  return <InvitationRender invitation={invitation} qrUrl={qrUrl} />;
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
