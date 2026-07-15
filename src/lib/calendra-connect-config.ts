const getPublicHttpUrl = (value: string | undefined) => {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

export const CALENDRA_CONNECT_LANDING_URL = "https://calendra.si/calendra-connect";
export const GOOGLE_PLAY_APP_URL = getPublicHttpUrl(import.meta.env.VITE_GOOGLE_PLAY_URL);
export const APP_STORE_APP_URL = getPublicHttpUrl(import.meta.env.VITE_APP_STORE_URL);
export const CALENDRA_CONNECT_STORE_URLS = [GOOGLE_PLAY_APP_URL, APP_STORE_APP_URL].filter(
  (url): url is string => Boolean(url),
);
