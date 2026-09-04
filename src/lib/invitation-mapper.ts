import type { Design02Row } from "@/lib/supabase.server";
import type { Invitation, InvocationType, WeddingEvent, GalleryImage } from "@/data/invitation";

type SocialLink = {
  label?: string | null;
  url?: string | null;
  icon?: string | null;
};

export type ShopInfo = {
  name: string | null;
  location: string | null;
  contact: string | null;
  locationUrl: string | null;
};

export type LifecycleStatus =
  | "active"
  | "draft"
  | "archived"
  | "not_yet_active"
  | "expired"
  | "invalid";

export function checkLifecycle(row: Design02Row | null): {
  status: LifecycleStatus;
  shop: ShopInfo;
  invitation: Invitation | null;
} {
  const shop: ShopInfo = row
    ? {
        name: row.shop_name_02,
        location: row.shop_location_02,
        contact: row.shop_contact_02,
        locationUrl: row.shop_location_url_02,
      }
    : { name: null, location: null, contact: null, locationUrl: null };

  if (!row) return { status: "invalid", shop, invitation: null };

  const now = Date.now();
  const activeFrom = new Date(row.active_from_02).getTime();
  const activeUntil = new Date(row.active_until_02).getTime();

  if (row.status_02 === "draft") return { status: "draft", shop, invitation: null };
  if (row.status_02 === "archived") return { status: "archived", shop, invitation: null };
  if (now < activeFrom) return { status: "not_yet_active", shop, invitation: null };
  if (now > activeUntil) return { status: "expired", shop, invitation: null };

  return { status: "active", shop, invitation: mapRowToInvitation(row) };
}

export function mapRowToInvitation(row: Design02Row): Invitation {
  const kind = normalizeInvocationKind(row.opening_kind_02);
  const direction = row.opening_direction_02?.toLowerCase() === "rtl";

  const defaultWeddingDateISO =
    row.wedding_date_02 ?? row.active_from_02 ?? new Date().toISOString();

  const headlineDate =
    row.headline_date_02 ??
    formatWeddingDateLabel(new Date(defaultWeddingDateISO));

  const events = normalizeEvents(row.events_02);
  const gallery = normalizeGallery(row.couple_photos_02);
  const memories = normalizeGallery(row.memories_gallery_02);
  const social = normalizeSocial(row.social_links_02);
  const parents = normalizeParents(row.parents_02);
  const relatives = normalizeRelatives(row.relatives_02);
  const messageLines = splitLines(row.message_body_02 ?? "");
  const closingLines = splitLines(row.message_closing_02 ?? "");

  const joiner = row.couple_joiner_02?.trim() ? row.couple_joiner_02 : "&";

  const primaryEvent = events[0] ?? {
    name: "",
    date: "",
    time: "",
    venue: row.venue_name_02,
    address: row.venue_address_02,
    city: row.venue_city_02,
    mapsUrl: row.venue_maps_url_02,
  };

  return {
    brideName: row.bride_name_02,
    groomName: row.groom_name_02,
    hashtag: `#${slugify(row.groom_name_02)}Weds${slugify(row.bride_name_02)}`,
    invocation: {
      type: kind,
      text: row.opening_text_02 ?? "",
      transliteration: row.opening_translation_02,
      rtl: direction,
    },
    weddingDateLabel: headlineDate,
    weddingDateISO: defaultWeddingDateISO,

    intro: {
      eyebrow: row.message_kicker_02 ?? "Together with their families",
      lines:
        messageLines.length > 0
          ? messageLines
          : [
              "Two families, one prayer,",
              "and a promise written long before us.",
              "We invite you to witness the beginning",
              "of our forever.",
            ],
      verse:
        "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.”",
      verseSource: "— Surah Ar-Rum 30:21",
    },

    events,

    venue: {
      name: row.venue_name_02,
      address: row.venue_address_02,
      city: row.venue_city_02,
      landmark: row.shop_location_02 ?? "",
      mapsUrl: row.venue_maps_url_02,
      imageUrl: row.venue_image_url_02 ?? null,
    },

    gallery: gallery.length > 0 ? gallery : fallbackGallery(row),

    closing: {
      kicker: "With love",
      message: closingLines.length > 0 ? closingLines : ["We look forward", "to celebrating", "with you"],
      title: row.finale_title_02 ?? null,
      note: row.finale_note_02 ?? null,
      qrEnabled: row.finale_qr_enabled_02 ?? true,
      qrCenterText: row.qr_center_text_02 ?? "Groom & Bride Invites",
    },

    contact: {
      whatsapp: primaryContact(social, "whatsapp"),
      phone: primaryContact(social, "phone"),
    },

    music: {
      src: "",
      title: row.music_label_02 ?? "Ambient oud",
      enabled: row.music_enabled_02 ?? true,
    },

    rsvp: {
      deadline: row.rsvp_deadline_02 ?? null,
    },

    extra: {
      parents,
      education: row.education_02 ?? null,
      occupation: row.occupation_02 ?? null,
      relatives,
      memories,
      social,
      slug: row.slug_02,
      groomPhotoUrl: row.groom_photo_url_02 ?? null,
      bridePhotoUrl: row.bride_photo_url_02 ?? null,
    },
  };
}

function normalizeInvocationKind(kind: string): InvocationType {
  const k = kind.toLowerCase();
  if (k === "allah" || k === "om" || k === "christian" || k === "custom" || k === "none") {
    return k as InvocationType;
  }
  if (!kind || kind === "none") return "none";
  return "custom";
}

function normalizeEvents(raw: Array<Record<string, unknown>>): WeddingEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => ({
      name: str(e.name),
      date: str(e.date),
      time: str(e.time),
      venue: str(e.venue),
      address: str(e.address),
      city: str(e.city),
      mapsUrl: str(e.mapsUrl) || str(e.maps_url),
    }))
    .filter((e) => e.name || e.venue);
}

function normalizeGallery(raw: Array<Record<string, unknown>>): GalleryImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((g) => {
      const src = str(g.src) || str(g.url);
      return {
        src,
        alt: str(g.alt) || "Photo",
        width: num(g.width, 900),
        height: num(g.height, 1300),
      };
    })
    .filter((g) => g.src);
}

function fallbackGallery(row: Design02Row): GalleryImage[] {
  const out: GalleryImage[] = [];
  if (row.venue_image_url_02) {
    out.push({ src: row.venue_image_url_02, alt: "Venue", width: 1400, height: 900 });
  }
  return out;
}

function normalizeSocial(raw: Array<Record<string, unknown>>): SocialLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => ({
      label: str(s.label),
      url: str(s.url),
      icon: str(s.icon),
    }))
    .filter((s) => s.url);
}

function normalizeParents(raw: Record<string, unknown>): Array<{ side: string; text: string }> {
  if (!raw || typeof raw !== "object") return [];
  return Object.entries(raw).map(([side, text]) => ({
    side,
    text: typeof text === "string" ? text : String(text ?? ""),
  }));
}

function normalizeRelatives(raw: Record<string, unknown>): Array<{ label: string; names: string }> {
  if (!raw || typeof raw !== "object") return [];
  return Object.entries(raw).map(([label, names]) => ({
    label,
    names: typeof names === "string" ? names : String(names ?? ""),
  }));
}

function primaryContact(social: SocialLink[], kind: string): string {
  const entry = social.find(
    (s) => (s.icon ?? "").toLowerCase() === kind || (s.label ?? "").toLowerCase() === kind,
  );
  if (!entry) {
    const phoneEntry = social.find(
      (s) => /^(tel:|https?:\/\/wa\.me|whatsapp|phone|mobile)/i.test(entry.url ?? s.url ?? ""),
    );
    if (phoneEntry?.url) return extractDigits(phoneEntry.url);
    return "";
  }
  return extractDigits(entry.url ?? "");
}

function extractDigits(s: string): string {
  return s.replace(/[^\d]/g, "");
}

function str(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function splitLines(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter(Boolean);
}

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-+/g, "");
}

function formatWeddingDateLabel(d: Date): string {
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
