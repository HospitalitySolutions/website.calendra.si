export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/maps/search/?api=1&query=Calendra&query_place_id=ChIJm6_tDR93b0cRZhhgh_KBCd0";

export const FACEBOOK_PROFILE_URL = "https://www.facebook.com/profile.php?id=61590713483596";
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/calendra_si/";
export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/company/135116409/";

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
export const OFFICIAL_PROFILE_URLS = Array.from(new Set([
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  import.meta.env.VITE_YOUTUBE_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  import.meta.env.VITE_GOOGLE_PLAY_URL,
  import.meta.env.VITE_APP_STORE_URL,
].filter(isPublicHttpUrl)));
