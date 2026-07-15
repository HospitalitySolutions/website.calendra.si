export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/maps/search/?api=1&query=Calendra&query_place_id=ChIJm6_tDR93b0cRZhhgh_KBCd0";

const isPublicHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

/**
 * Official profiles that can be safely declared as the same organization.
 * Social and app-store links are build-time settings because their final URLs
 * are not stored elsewhere in this website repository.
 */
export const OFFICIAL_PROFILE_URLS = [
  import.meta.env.VITE_LINKEDIN_URL,
  import.meta.env.VITE_YOUTUBE_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  import.meta.env.VITE_GOOGLE_PLAY_URL,
  import.meta.env.VITE_APP_STORE_URL,
].filter(isPublicHttpUrl);
