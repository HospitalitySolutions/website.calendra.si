const trimUrl = (value: string) => value.replace(/\/+$/, "");

export const SITE_URL = trimUrl(import.meta.env.VITE_SITE_URL || "https://calendra.si");
export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "calendra.si";
  }
})();

export const APP_BASE_URL = trimUrl(import.meta.env.VITE_APP_BASE_URL || "https://app.calendra.si");
