# Cinematic Vows

BUILD PROMPT — CINEMATIC SINGLE-PAGE DIGITAL WEDDING INVITATION

Build ONLY the public-facing digital wedding invitation shown in the supplied reference reel/video.

Do NOT build a SaaS platform. Do NOT build an admin dashboard. Do NOT build authentication. Do NOT build subscriptions. Do NOT build a database. Do NOT build multi-tenancy. Do NOT build a template marketplace.

The entire task is to create one exceptionally polished, responsive, single-page digital wedding invitation that visually and interactively recreates the supplied reference video.

The supplied video is the PRIMARY visual reference.

1. PRIMARY OBJECTIVE

Create a premium digital wedding invitation that feels like the reference reel has been transformed into an interactive mobile webpage.

The visitor should feel as if they are experiencing a cinematic wedding invitation rather than browsing a normal website.

The experience must be:

luxurious

cinematic

elegant

emotional

sophisticated

culturally adaptable

mobile-first

smooth

highly visual

animation-heavy but performant

The final result should look good enough to show directly to a wedding-card printing business as a commercial demo.

2. SINGLE PAGE ONLY

There must be ONE public route/page.

For example:

/invite

or simply:

/

Everything happens on this page.

Do not create separate pages for:

About

Events

Gallery

Venue

RSVP

Contact

All of these must be sections of the same continuous invitation experience.

The visitor scrolls vertically through the entire invitation.

3. REFERENCE VIDEO

Use the supplied reference video as the visual and animation reference.

Study the reference carefully before implementing.

Replicate its:

visual hierarchy

cinematic pacing

typography scale

transitions

spacing

decorative elements

image presentation

reveal timing

section rhythm

elegant movement

overall wedding-card aesthetic

Do not simply make a conventional website with similar colors.

The goal is to recreate the experience and visual language of the reference.

Use original HTML/CSS/React implementation and original/placeholder assets rather than copying copyrighted assets from the video.

4. TECHNOLOGY

Use a modern component-based frontend.

Preferred:

React

TypeScript

Vite or Next.js

Tailwind CSS

Framer Motion / Motion

CSS animations where appropriate

The important requirement is that this MUST NOT be a plain static HTML page with all wedding information hardcoded into visible markup.

Use a component architecture so that the invitation content can later be connected to a backend/admin system.

5. CONTENT DATA MODEL

For this prototype, keep the wedding information in ONE clearly separated data/config object.

Example conceptual structure:

const invitation = {
  brideName: "Ayesha",
  groomName: "Ahmed",

  invocation: {
    type: "allah",
    text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
  },

  weddingDate: "...",

  events: [
    {
      name: "Nikah",
      date: "...",
      time: "...",
      venue: "...",
      address: "...",
      mapsUrl: "..."
    },
    {
      name: "Walima",
      date: "...",
      time: "...",
      venue: "...",
      address: "...",
      mapsUrl: "..."
    }
  ],

  gallery: [],

  contact: {
    whatsapp: "",
    phone: ""
  }
}


IMPORTANT:

The UI must consume this data object.

Do NOT scatter names, dates and venue text throughout dozens of components.

This is specifically so the prototype can later be connected to an admin/backend without rebuilding the design.

6. OPENING / HERO

The opening must be the strongest part of the experience.

Create a full-screen cinematic opening.

Use:

elegant background

subtle texture

ornamental details

premium typography

invocation

couple names

wedding date

Create a staged reveal.

Suggested sequence:

Background fades in.

Decorative ornament subtly appears.

Invocation fades/reveals.

Wedding date appears.

Bride name elegantly enters.

"&" appears.

Groom name enters.

Decorative elements complete the composition.

A subtle scroll cue appears.

Do not make these animations fast.

They should feel deliberate and luxurious.

7. INVOCATION

The invitation must support different opening traditions.

Create a configurable invocation value.

Examples:

Muslim

Arabic Bismillah.

Hindu

ॐ

or custom text.

Christian

Custom Christian invocation.

Other

Custom invocation.

None

No invocation.

The design must NOT be permanently tied to one religion.

The current demo may use the appropriate invocation for the reference design, but the component should support changing it later.

Support:

Arabic

Urdu

Hindi

English

Telugu

Unicode text

Use proper RTL layout for Arabic/Urdu.

8. COUPLE NAMES

The couple names must be visually dominant.

Example:

AHMED

&

AYESHA


or an equivalent composition matching the reference.

Use sophisticated typography.

Do not use generic default fonts.

Choose an elegant serif/display combination and a complementary body font.

Make the names animate independently.

9. SCROLL EXPERIENCE

The entire invitation should feel cinematic as the user scrolls.

Implement:

smooth section transitions

fade reveals

subtle scale

opacity transitions

parallax

image movement

text movement

decorative movement

sticky sections where appropriate

masked reveals

staggered animations

Use Framer Motion / Motion or performant CSS/Intersection Observer techniques.

Do not attach expensive continuous scroll calculations unnecessarily.

10. SECTION STRUCTURE

Create the invitation as a sequence of cinematic sections.

Suggested structure:

SECTION 01

Opening invocation

SECTION 02

Couple names

SECTION 03

Wedding introduction/message

SECTION 04

Wedding date/countdown

SECTION 05

Events

SECTION 06

Venue

SECTION 07

Couple/gallery imagery

SECTION 08

Final invitation/message

SECTION 09

RSVP/contact

SECTION 10

Elegant closing frame

The exact composition should follow the supplied reel rather than looking like a generic website.

11. EVENT DESIGN

Events should not look like boring dashboard cards.

Present them as elegant invitation typography.

Example:

NIKAH

14 DECEMBER
2026

11:00 AM

VENUE NAME
HYDERABAD


Then:

VIEW LOCATION

The same structure should support multiple events.

Example events:

Engagement

Mehendi

Haldi

Nikah

Wedding

Reception

Walima

Sangeet

Custom event

The current demo can use 2–3 events.

12. COUNTDOWN

Add a visually elegant countdown.

Display:

Days

Hours

Minutes

Seconds

Animate numbers subtly.

Do not make it look like a generic digital timer.

Integrate it naturally into the invitation design.

After the wedding date passes, display an appropriate completion message.

13. VENUE

Include:

venue name

address

city

landmark if available

GET DIRECTIONS

The Maps button should open the configured Google Maps URL.

Make this section visually consistent with the invitation.

14. GALLERY

Create a cinematic photo presentation rather than a generic image grid.

Use:

large portrait images

full-width images

staggered compositions

overlapping imagery

subtle zoom

fade transitions

parallax

lightbox when clicked

Use placeholder images for the prototype if required.

Make sure the layout works beautifully on mobile.

15. FINAL MESSAGE

Create a beautiful closing section.

Example:

WITH LOVE

AHMED & AYESHA

WE LOOK FORWARD
TO CELEBRATING
WITH YOU


Then include:

RSVP

WhatsApp

phone

optional social links

The ending should feel like the final frame of the reference reel.

16. MUSIC

Include optional background music support.

For the prototype:

provide a configurable audio source

include a music control

do not force autoplay with sound

Because browsers commonly block audio autoplay, create an opening interaction such as:

OPEN INVITATION

After the user interacts, audio may begin.

Include a discreet music play/pause control.

Do not use the copyrighted music from the supplied reel unless it is appropriately licensed.

17. MOBILE FIRST

The primary target is a smartphone.

Design specifically for:

320px

360px

375px

390px

412px

430px

The mobile experience should feel intentional, not like a desktop site squeezed into a phone.

Pay particular attention to:

typography

vertical spacing

image cropping

animation timing

touch targets

scrolling

viewport height

safe areas

No horizontal scrolling.

18. DESKTOP

The same invitation must work responsively on desktop.

Do not stretch everything unnecessarily.

Use a controlled elegant content width.

The desktop experience should feel like a premium digital invitation displayed on a large screen.

19. DESIGN DETAILS

Use:

refined typography

subtle textures

elegant borders

thin ornamental lines

sophisticated spacing

restrained shadows

cinematic image transitions

delicate decorative motifs

Avoid:

generic cards

excessive rounded corners

neon colors

SaaS styling

excessive gradients

huge buttons

emoji

generic stock landing-page layouts

20. PERFORMANCE

Despite the cinematic appearance, the page must remain fast.

Use:

optimized images

lazy loading

responsive image sizes

transform/opacity animations

minimal JavaScript

GPU-friendly animation

code splitting where appropriate

Do not use heavy libraries unnecessarily.

Respect:

prefers-reduced-motion

When reduced motion is enabled, replace complex animations with simple fades.

21. ACCESSIBILITY

Include:

semantic HTML

alt text

accessible buttons

keyboard navigation where relevant

visible focus states

sufficient contrast

reduced-motion support

22. COMPONENT ARCHITECTURE

Create reusable components such as:

Invitation
├── Opening
├── Invocation
├── CoupleHero
├── Intro
├── Countdown
├── Events
├── EventItem
├── Venue
├── Gallery
├── RSVP
├── Contact
├── MusicControl
└── Closing


Keep each component focused.

All content should come from the central invitation data object.

23. IMPORTANT — DO NOT OVERBUILD

This is a visual prototype.

DO NOT build:

authentication

2FA

admin dashboard

database

Supabase

subscriptions

shop accounts

multi-tenancy

customer management

template marketplace

billing

analytics dashboard

CMS

Those will be built later.

For NOW:

Only build the single public wedding invitation.

24. DELIVERABLE

The final result should be a complete working single-page invitation.

When I open the project, I should immediately see the invitation.

There should be no unnecessary landing page explaining the product.

No "Welcome to our platform".

No SaaS marketing page.

The invitation itself IS the product.

25. MOST IMPORTANT REQUIREMENT

Do not interpret this prompt as permission to create your own generic wedding website.

The supplied reference reel is the visual benchmark.

Before coding, analyze the reference's:

composition

sequence

visual rhythm

typography

transitions

image treatment

ornamentation

spacing

cinematic feel

Then reproduce that experience as a responsive interactive webpage.

The final page should look and feel like the reference reel has been converted from video into an interactive, scroll-driven wedding invitation.

Prioritize visual fidelity and animation quality over adding extra features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ed5616e7-b7d4-48f7-812a-72eb15278f6d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
