import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Design02Row = {
  id_02: string;
  invitation_code_02: string;
  slug_02: string;
  status_02: "draft" | "active" | "archived" | string;
  active_from_02: string;
  active_until_02: string;
  wedding_date_02: string | null;
  opening_kind_02: "allah" | "om" | "christian" | "custom" | "none" | string;
  opening_text_02: string | null;
  opening_translation_02: string | null;
  opening_direction_02: "ltr" | "rtl" | string;
  groom_name_02: string;
  bride_name_02: string;
  couple_joiner_02: string | null;
  groom_photo_url_02: string | null;
  bride_photo_url_02: string | null;
  parents_02: Record<string, unknown>;
  education_02: string | null;
  occupation_02: string | null;
  relatives_02: Record<string, unknown>;
  venue_name_02: string;
  venue_address_02: string;
  venue_city_02: string;
  venue_maps_url_02: string;
  venue_image_url_02: string | null;
  events_02: Array<Record<string, unknown>>;
  couple_photos_02: Array<Record<string, unknown>>;
  memories_gallery_02: Array<Record<string, unknown>>;
  social_links_02: Array<Record<string, unknown>>;
  headline_date_02: string | null;
  message_kicker_02: string | null;
  message_body_02: string | null;
  message_closing_02: string | null;
  rsvp_deadline_02: string | null;
  music_enabled_02: boolean | null;
  music_label_02: string | null;
  finale_title_02: string | null;
  finale_note_02: string | null;
  finale_qr_enabled_02: boolean | null;
  qr_center_text_02: string;
  shop_name_02: string | null;
  shop_location_02: string | null;
  shop_contact_02: string | null;
  shop_location_url_02: string | null;
  created_by_02: string;
  updated_by_02: string | null;
  created_at_02: string;
  updated_at_02: string;
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY server env vars. Never expose these via VITE_* variables.",
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function fetchInvitationBySlug(slug: string): Promise<Design02Row | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("design_02_invitations")
    .select("*")
    .eq("slug_02", slug)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[design_02_invitations] fetch error:", error);
    return null;
  }
  return (data as Design02Row) ?? null;
}

export type { Design02Row };
