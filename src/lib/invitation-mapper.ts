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
  | "request_error"
  | "invalid"
  | "fallback";
