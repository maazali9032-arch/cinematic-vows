// @ts-nocheck -- RPC fields are validated at runtime before they are rendered.
import { createClient } from "@supabase/supabase-js";
import type { Invitation, PublicContact, WeddingEvent, GalleryImage } from "@/data/invitation";
import type { ShopInfo } from "@/lib/invitation-mapper";

export type PublicInvitationResult =
  | { state: "live"; invitation: Invitation }
  | { state: "fallback"; shop: ShopInfo }
  | { state: "not_found" }
  | { state: "request_error" };

type RecordValue = Record<string, unknown>;

export async function fetchPublicInvitation(slug: string): Promise<PublicInvitationResult> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !slug) return { state: "request_error" };

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc("get_public_invitation_content", { p_slug: slug });
    if (error) return { state: "request_error" };

    const payload = unwrap(data);
    if (payload.state === "fallback") return { state: "fallback", shop: mapShop(payload.shop) };
    if (payload.state === "not_found") return { state: "not_found" };
    if (payload.state !== "live") return { state: "request_error" };

    const content = record(payload.content);
    if (!content) return { state: "request_error" };
    return { state: "live", invitation: mapInvitation(content, record(payload.invitation), slug) };
  } catch {
    return { state: "request_error" };
  }
}

function unwrap(value: unknown): RecordValue {
  const outer = record(value) ?? {};
  return record(outer.data) ?? outer;
}

function mapInvitation(
  content: RecordValue,
  invitation: RecordValue | null,
  slug: string,
): Invitation {
  const weddingDate = text(content.wedding_date);
  return {
    groomName: text(content.groom_name),
    brideName: text(content.bride_name),
    invocation: text(content.invocation),
    weddingDateLabel: weddingDate,
    weddingDateISO: toDateTime(weddingDate, text(content.start_time)),
    events: mapEvents(content.events),
    venue: {
      name: text(content.venue_name),
      address: text(content.venue_address),
      city: text(content.city),
      landmark: "",
      mapsUrl: text(content.maps_url),
      imageUrl: nullableText(content.venue_image_url),
    },
    gallery: mapGallery(content.gallery),
    contacts: mapContacts(content.contacts),
    qrText: nullableText(content.qr_text),
    publicUrl: nullableText(invitation?.public_url),
    slug,
    intro: { eyebrow: "", lines: [], verse: "", verseSource: "" },
    extra: {
      groomPhotoUrl: null,
      bridePhotoUrl: null,
      parents: [],
      education: null,
      occupation: null,
      relatives: [],
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
    music: { src: "", title: "", enabled: false },
    rsvp: { deadline: null },
  };
}

function mapEvents(value: unknown): WeddingEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const event = record(item);
    if (!event) return [];
    const name = text(event.name ?? event.title ?? event.event_name);
    const venue = text(event.venue ?? event.venue_name);
    const date = text(event.date ?? event.event_date);
    const time = text(event.time ?? event.start_time);
    if (!name && !venue && !date && !time) return [];
    return [
      {
        name,
        venue,
        date,
        time,
        address: text(event.address),
        city: text(event.city),
        mapsUrl: text(event.maps_url ?? event.mapsUrl),
      },
    ];
  });
}

function mapGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item)
      return [{ src: item, alt: "Wedding photo", width: 900, height: 1200 }];
    const image = record(item);
    const src = text(image?.url ?? image?.src ?? image?.image_url);
    if (!src) return [];
    return [
      {
        src,
        alt: text(image?.alt ?? image?.caption) || "Wedding photo",
        width: positive(image?.width, 900),
        height: positive(image?.height, 1200),
      },
    ];
  });
}

function mapContacts(value: unknown): PublicContact[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 2).flatMap((item) => {
    const contact = record(item);
    const phone = text(contact?.phone);
    return phone
      ? [
          {
            name: nullableText(contact?.name),
            phone,
            whatsappUrl: nullableText(contact?.whatsapp_url),
          },
        ]
      : [];
  });
}

function mapShop(value: unknown): ShopInfo {
  const shop = record(value) ?? {};
  const address = [text(shop.address), text(shop.city)].filter(Boolean).join(", ");
  return {
    name: nullableText(shop.name),
    location: address || null,
    contact: nullableText(shop.business_contact ?? shop.phone ?? shop.whatsapp),
    locationUrl: null,
  };
}

function toDateTime(date: string, time: string): string {
  if (!date) return "";
  const parsed = new Date(time ? `${date} ${time}` : date);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
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
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
