export interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  mapsUrl: string;
}
export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface PublicContact {
  name: string | null;
  phone: string;
  whatsappUrl: string | null;
}
export interface Parent {
  side: string;
  text: string;
}
export interface Relative {
  label: string;
  names: string;
}
export interface SocialLink {
  label?: string | null;
  url?: string | null;
  icon?: string | null;
}
export interface Invitation {
  groomName: string;
  brideName: string;
  invocation: string;
  weddingDateLabel: string;
  weddingDateISO: string;
  events: WeddingEvent[];
  venue: {
    name: string;
    address: string;
    city: string;
    landmark: string;
    mapsUrl: string;
    imageUrl: string | null;
  };
  gallery: GalleryImage[];
  contacts: PublicContact[];
  qrText: string | null;
  publicUrl: string | null;
  slug: string;
  intro: { eyebrow: string; lines: string[]; verse: string; verseSource: string };
  extra: {
    groomPhotoUrl: string | null;
    bridePhotoUrl: string | null;
    parents: Parent[];
    education: string | null;
    occupation: string | null;
    relatives: Relative[];
    memories: GalleryImage[];
    social: SocialLink[];
  };
  closing: {
    kicker: string;
    message: string[];
    title: string | null;
    note: string | null;
    qrEnabled: boolean;
    qrCenterText: string;
  };
  contact: { whatsapp: string; phone: string };
  hashtag: string;
  music: { src: string; title: string; enabled: boolean };
  rsvp: { deadline: string | null };
}
