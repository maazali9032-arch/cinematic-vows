import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

export type InvocationType = "allah" | "om" | "christian" | "custom" | "none";

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

export const invitation = {
  brideName: "Ayesha",
  groomName: "Ahmed",
  hashtag: "#AhmedWedsAyesha",

  invocation: {
    type: "allah" as InvocationType,
    text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "In the name of Allah, the Most Gracious, the Most Merciful",
    rtl: true,
  },

  weddingDateLabel: "Fourteenth of December, Two Thousand Twenty Six",
  weddingDateISO: "2026-12-14T11:00:00+05:30",

  intro: {
    eyebrow: "Together with their families",
    lines: [
      "Two families, one prayer,",
      "and a promise written long before us.",
      "We invite you to witness the beginning",
      "of our forever.",
    ],
    verse:
      "“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts.”",
    verseSource: "— Surah Ar-Rum 30:21",
  },

  events: [
    {
      name: "Mehendi",
      date: "12 December 2026",
      time: "6:00 PM onwards",
      venue: "The Courtyard, Falaknuma Gardens",
      address: "Engine Bowli, Falaknuma",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Falaknuma+Hyderabad",
    },
    {
      name: "Nikah",
      date: "14 December 2026",
      time: "11:00 AM",
      venue: "Masjid-e-Noor Banquet",
      address: "Road No. 12, Banjara Hills",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
    },
    {
      name: "Walima",
      date: "15 December 2026",
      time: "7:30 PM",
      venue: "The Mirror Hall, Taj Krishna",
      address: "Road No. 1, Banjara Hills",
      city: "Hyderabad",
      mapsUrl: "https://maps.google.com/?q=Taj+Krishna+Hyderabad",
    },
  ] as WeddingEvent[],

  venue: {
    name: "The Mirror Hall, Taj Krishna",
    address: "Road No. 1, Banjara Hills",
    city: "Hyderabad, Telangana 500034",
    landmark: "Opposite NFCL Park",
    mapsUrl: "https://maps.google.com/?q=Taj+Krishna+Hyderabad",
  },

  gallery: [
    { src: gallery1, alt: "The couple in traditional attire by candlelight", width: 900, height: 1300 },
    { src: gallery2, alt: "Henna adorned hands holding gold jewellery", width: 900, height: 1200 },
    { src: gallery3, alt: "Candlelit wedding hall with marble arches", width: 1400, height: 900 },
  ] as GalleryImage[],

  closing: {
    kicker: "With love",
    message: ["We look forward", "to celebrating", "with you"],
  },

  contact: {
    whatsapp: "+919876543210",
    phone: "+919876543210",
  },

  music: {
    src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-145038.mp3",
    title: "Ambient oud",
  },
};

export type Invitation = typeof invitation;
