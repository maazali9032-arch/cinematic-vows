import { createClient } from "@supabase/supabase-js";
import type { Design02Row } from "@/lib/supabase.server";
import { mapRowToInvitation, type ShopInfo } from "@/lib/invitation-mapper";
import type { Invitation } from "@/data/invitation";

export type PublicInvitationResult =
  | { state: "live"; invitation: Invitation; shop: ShopInfo }
  | { state: "fallback" | "not_found"; shop: ShopInfo }
  | { state: "request_error"; shop: ShopInfo };

type UnknownRecord = Record<string, unknown>;

const emptyShop: ShopInfo = { name: null, location: null, contact: null, locationUrl: null };

/**
 * Fetches public invitation data through the database's intentionally public RPC.
 * The adapter accepts both Supabase's { data } envelope and a direct RPC payload.
 */
export async function fetchPublicInvitation(slug: string): Promise<PublicInvitationResult> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey || !slug) return { state: "request_error", shop: emptyShop };

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc("get_public_invitation_content", { p_slug: slug });
    if (error) {
      console.error("[get_public_invitation_content] RPC error:", error.message);
      return { state: "request_error", shop: emptyShop };
    }

    const payload = unwrapPayload(data);
    const state = typeof payload.state === "string" ? payload.state.toLowerCase() : "";
    const shop = readShop(payload.shop ?? payload.content);

    if (state === "fallback") return { state: "fallback", shop };
    if (state === "not_found") return { state: "not_found", shop };
    if (state !== "live") return { state: "request_error", shop };

    const content = asRecord(payload.content);
    if (!content) return { state: "request_error", shop };
    return { state: "live", invitation: mapRowToInvitation(normalizeContent(content, slug)), shop };
  } catch (error) {
    console.error("[get_public_invitation_content] request failed:", error);
    return { state: "request_error", shop: emptyShop };
  }
}

function unwrapPayload(value: unknown): UnknownRecord {
  const outer = asRecord(value) ?? {};
  return asRecord(outer.data) ?? outer;
}

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as UnknownRecord) : null;
}

function readShop(value: unknown): ShopInfo {
  const shop = asRecord(value) ?? {};
  return {
    name: text(shop.name ?? shop.shop_name ?? shop.shop_name_02) || null,
    location: text(shop.location ?? shop.shop_location ?? shop.shop_location_02) || null,
    contact: text(shop.contact ?? shop.shop_contact ?? shop.shop_contact_02) || null,
    locationUrl: text(shop.locationUrl ?? shop.location_url ?? shop.shop_location_url ?? shop.shop_location_url_02) || null,
  };
}

function normalizeContent(content: UnknownRecord, slug: string): Design02Row {
  const field = (...names: string[]) => names.map((name) => content[name]).find((value) => value != null);
  const array = (...names: string[]) => {
    const value = field(...names);
    return Array.isArray(value) ? value.filter(asRecord) : [];
  };
  const object = (...names: string[]) => asRecord(field(...names)) ?? {};
  const string = (...names: string[]) => text(field(...names));

  return {
    id_02: string("id_02", "id"),
    invitation_code_02: string("invitation_code_02", "invitation_code"),
    slug_02: string("slug_02", "slug") || slug,
    status_02: string("status_02", "status") || "active",
    active_from_02: string("active_from_02", "active_from") || new Date(0).toISOString(),
    active_until_02: string("active_until_02", "active_until") || "9999-12-31T23:59:59.999Z",
    wedding_date_02: nullable(string("wedding_date_02", "wedding_date")),
    opening_kind_02: string("opening_kind_02", "opening_kind") || "none",
    opening_text_02: nullable(string("opening_text_02", "opening_text")),
    opening_translation_02: nullable(string("opening_translation_02", "opening_translation")),
    opening_direction_02: string("opening_direction_02", "opening_direction") || "ltr",
    groom_name_02: string("groom_name_02", "groom_name", "groomName"),
    bride_name_02: string("bride_name_02", "bride_name", "brideName"),
    couple_joiner_02: nullable(string("couple_joiner_02", "couple_joiner")),
    groom_photo_url_02: nullable(string("groom_photo_url_02", "groom_photo_url")),
    bride_photo_url_02: nullable(string("bride_photo_url_02", "bride_photo_url")),
    parents_02: object("parents_02", "parents"), education_02: nullable(string("education_02", "education")), occupation_02: nullable(string("occupation_02", "occupation")),
    relatives_02: object("relatives_02", "relatives"), venue_name_02: string("venue_name_02", "venue_name"), venue_address_02: string("venue_address_02", "venue_address"), venue_city_02: string("venue_city_02", "venue_city"), venue_maps_url_02: string("venue_maps_url_02", "venue_maps_url"), venue_image_url_02: nullable(string("venue_image_url_02", "venue_image_url")),
    events_02: array("events_02", "events"), couple_photos_02: array("couple_photos_02", "couple_photos", "gallery"), memories_gallery_02: array("memories_gallery_02", "memories_gallery", "memories"), social_links_02: array("social_links_02", "social_links", "social"),
    headline_date_02: nullable(string("headline_date_02", "headline_date")), message_kicker_02: nullable(string("message_kicker_02", "message_kicker")), message_body_02: nullable(string("message_body_02", "message_body")), message_closing_02: nullable(string("message_closing_02", "message_closing")), rsvp_deadline_02: nullable(string("rsvp_deadline_02", "rsvp_deadline")),
    music_enabled_02: booleanOrNull(field("music_enabled_02", "music_enabled")), music_label_02: nullable(string("music_label_02", "music_label")), finale_title_02: nullable(string("finale_title_02", "finale_title")), finale_note_02: nullable(string("finale_note_02", "finale_note")), finale_qr_enabled_02: booleanOrNull(field("finale_qr_enabled_02", "finale_qr_enabled")), qr_center_text_02: string("qr_center_text_02", "qr_center_text"),
    shop_name_02: nullable(string("shop_name_02", "shop_name")), shop_location_02: nullable(string("shop_location_02", "shop_location")), shop_contact_02: nullable(string("shop_contact_02", "shop_contact")), shop_location_url_02: nullable(string("shop_location_url_02", "shop_location_url")),
    created_by_02: string("created_by_02", "created_by"), updated_by_02: nullable(string("updated_by_02", "updated_by")), created_at_02: string("created_at_02", "created_at"), updated_at_02: string("updated_at_02", "updated_at"),
  };
}

function text(value: unknown): string { return typeof value === "string" ? value : value == null ? "" : String(value); }
function nullable(value: string): string | null { return value || null; }
function booleanOrNull(value: unknown): boolean | null { return typeof value === "boolean" ? value : null; }
