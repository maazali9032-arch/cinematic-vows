import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Invitation, PublicContact, WeddingEvent, GalleryImage } from "@/data/invitation";
import type { ShopInfo } from "@/lib/invitation-mapper";

export type PublicInvitationResult =
  | { state: "live"; invitation: Invitation; brandName: string | null }
  | { state: "fallback"; shop: ShopInfo }
  | { state: "not_found" }
  | { state: "request_error" };

type RecordValue = Record<string, unknown>;
let publicClient: SupabaseClient | null = null;

export async function fetchPublicInvitation(slug: string): Promise<PublicInvitationResult> {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !anonKey || !slug) return { state: "request_error" };

  try {
    const supabase = (publicClient ??= createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }));
    const { data, error } = await supabase.rpc("get_public_invitation_content", { p_slug: slug });
    if (error) return { state: "request_error" };

    const payload = unwrap(data);
    if (payload["state"] === "fallback")
      return { state: "fallback", shop: mapShop(payload["shop"]) };
    if (payload["state"] === "not_found") return { state: "not_found" };
    if (payload["state"] !== "live") return { state: "request_error" };

    const content = record(payload["content"]);
    if (!content) return { state: "request_error" };
    return {
      state: "live",
      invitation: mapInvitation(content, record(payload["invitation"]), slug),
      brandName: nullableText(record(payload["shop"])?.["name"]),
    };
  } catch {
    return { state: "request_error" };
  }
}

function unwrap(value: unknown): RecordValue {
  const outer = record(value) ?? {};
  return record(outer["data"]) ?? outer;
}

function mapInvitation(
  content: RecordValue,
  invitation: RecordValue | null,
  slug: string,
): Invitation {
  const weddingDate = text(content["wedding_date"]);
  return {
    groomName: text(content["groom_name"]),
    brideName: text(content["bride_name"]),
    invocation: text(content["invocation"]),
    weddingDateLabel: dateLabel(weddingDate),
    startTime: timeLabel(text(content["start_time"])),
    endTime: timeLabel(text(content["end_time"])),
    profiles: ["groom", "bride"].flatMap((side) => {
      const profile = {
        name: text(content[`${side}_name`]),
        photo: safeUrl(content[`${side}_photo_url`]) || null,
        qualification: text(content[`${side}_qualification`]),
        occupation: text(content[`${side}_occupation`]),
        parents: text(content[`${side}_parents`]),
      };
      return profile.photo || profile.qualification || profile.occupation || profile.parents
        ? [profile]
        : [];
    }),
    weddingDateISO: toDateTime(weddingDate, text(content["start_time"])),
    events: mapEvents(content["events"]),
    venue: {
      name: text(content["venue_name"]),
      address: text(content["venue_address"]),
      city: text(content["city"]),
      landmark: "",
      mapsUrl: safeUrl(content["maps_url"]),
      imageUrl: safeUrl(content["venue_image_url"]) || null,
    },
    gallery: mapGallery(content["gallery"]),
    contacts: mapContacts(content["contacts"]),
    qrText: nullableText(content["qr_text"]),
    publicUrl: nullableText(invitation?.["public_url"]),
    slug,
    intro: { eyebrow: "", lines: [], verse: "", verseSource: "" },
    extra: {
      groomPhotoUrl: safeUrl(content["groom_photo_url"]) || null,
      bridePhotoUrl: safeUrl(content["bride_photo_url"]) || null,
      parents: [],
      education: null,
      occupation: null,
      relatives: text(content["relatives"])
        ? [{ label: "Family & relatives", names: text(content["relatives"]) }]
        : [],
      memories: [],
      social: [],
    },
    closing: {
      kicker: "",
      message: [],
      title: null,
      note: null,
      qrEnabled: false,
      qrCenterText: "",
    },
    contact: { whatsapp: "", phone: "" },
    hashtag: "",
    music: {
      src: safeUrl(content["music_url"]),
      title: "Invitation music",
      enabled: content["music_enabled"] === true,
    },
    rsvp: { deadline: null },
  };
}

function mapEvents(value: unknown): WeddingEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const event = record(item);
    if (!event) return [];
    const name = text(event["name"]) || text(event["title"]) || text(event["event_name"]);
    const venue = text(event["venue"]) || text(event["venue_name"]);
    const date = dateLabel(text(event["date"]) || text(event["event_date"]));
    const time = timeLabel(text(event["time"]) || text(event["start_time"]));
    const note = text(event["note"]) || text(event["description"]);
    const city = text(event["city"]);
    const mapsUrl = safeUrl(event["maps_url"]) || safeUrl(event["mapsUrl"]);
    if (!name && !venue && !date && !time && !note && !city && !mapsUrl) return [];
    return [
      {
        name,
        venue,
        date,
        time,
        address: "",
        note,
        city,
        mapsUrl,
      },
    ];
  });
}

function mapGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && safeUrl(item))
      return [{ src: safeUrl(item), alt: "Wedding photo", width: 900, height: 1200 }];
    const image = record(item);
    const src = safeUrl(image?.["url"]) || safeUrl(image?.["src"]) || safeUrl(image?.["image_url"]);
    if (!src) return [];
    return [
      {
        src,
        alt: text(image?.["alt"] ?? image?.["caption"]) || "Wedding photo",
        width: positive(image?.["width"], 900),
        height: positive(image?.["height"], 1200),
      },
    ];
  });
}

function mapContacts(value: unknown): PublicContact[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 2).flatMap((item) => {
    const contact = record(item);
    const phone = text(contact?.["phone"]);
    return phone
      ? [
          {
            name: nullableText(contact?.["name"]),
            phone,
            whatsappUrl: safeUrl(contact?.["whatsapp_url"]) || null,
          },
        ]
      : [];
  });
}

function mapShop(value: unknown): ShopInfo {
  const shop = record(value) ?? {};
  const address = [text(shop["address"]), text(shop["city"])].filter(Boolean).join(", ");
  return {
    name: nullableText(shop["name"]),
    location: address || null,
    contact:
      [text(shop["phone"]), text(shop["whatsapp"]), text(shop["business_contact"])]
        .filter(Boolean)
        .join(" · ") || null,
    locationUrl: null,
  };
}

function toDateTime(date: string, time: string): string {
  if (!date) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const calendarDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== date)
    return "";
  if (time && !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time)) return "";
  const parsed = new Date(`${date}T${time || "00:00:00"}`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

function dateLabel(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return value;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function timeLabel(value: string): string {
  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) return value;
  const hours = Number(value.slice(0, 2));
  return `${hours % 12 || 12}:${value.slice(3, 5)} ${hours < 12 ? "AM" : "PM"}`;
}
function record(value: unknown): RecordValue | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : null;
}
function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
function nullableText(value: unknown): string | null {
  return text(value) || null;
}
function positive(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function safeUrl(value: unknown): string {
  const input = text(value);
  try {
    const url = new URL(input);
    return url.protocol === "https:" || url.protocol === "http:" ? input : "";
  } catch {
    return "";
  }
}

export function slugFromPath(pathname: string): string | null {
  try {
    const slug = decodeURIComponent(pathname.split("/").filter(Boolean).at(-1) ?? "").trim();
    return slug && !/[\\/]/.test(slug) ? slug : null;
  } catch {
    return null;
  }
}
