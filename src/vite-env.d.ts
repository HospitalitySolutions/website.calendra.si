/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_APP_BASE_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_YOUTUBE_URL?: string;
  readonly VITE_GOOGLE_PLAY_URL?: string;
  readonly VITE_APP_STORE_URL?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  readonly VITE_UMAMI_HOST_URL?: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_BOOKING_DEMO_VIDEO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
