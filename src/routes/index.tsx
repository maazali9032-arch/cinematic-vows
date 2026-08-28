import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { invitation } from "@/data/invitation";
import { Opening } from "@/components/invitation/Opening";
import { CoupleHero } from "@/components/invitation/CoupleHero";
import { Countdown } from "@/components/invitation/Countdown";
import { MusicControl } from "@/components/invitation/MusicControl";
import { Closing, Events, Gallery, Intro, Venue } from "@/components/invitation/Sections";

const title = `${invitation.groomName} & ${invitation.brideName} — Wedding Invitation`;
const description = `Join ${invitation.groomName} and ${invitation.brideName} in ${invitation.venue.city} as they celebrate their Nikah and Walima, 14 December 2026.`;

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
  component: InvitationPage,
});

function InvitationPage() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Opening data={invitation} open={opened} onOpen={() => setOpened(true)} />
      <div aria-hidden={!opened}>
        <CoupleHero data={invitation} started={opened} />
        <Intro data={invitation} />
        <Countdown
          dateISO={invitation.weddingDateISO}
          names={`${invitation.groomName} & ${invitation.brideName}`}
        />
        <Events events={invitation.events} />
        <Venue venue={invitation.venue} />
        <Gallery images={invitation.gallery} />
        <Closing data={invitation} />
      </div>
      <MusicControl src={invitation.music.src} started={opened} />
    </main>
  );
}
