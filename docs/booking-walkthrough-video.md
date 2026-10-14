# Calendra online-booking video deployment

The marketing website includes the latest user-supplied Calendra online-booking recording:
- **Source:** Calendra_spletno_narocanje(2).mp4
- **Bundled path:** `public/videos/calendra-spletno-narocanje.mp4`
- **Public URL after deployment:** `https://calendra.si/videos/calendra-spletno-narocanje.mp4`
- **Size:** 1,327,466 bytes (about 1.3 MB); approximately 42 seconds, MP4.

The website shows the same clip in both places:
1. Homepage `/`, `/en` → *Ključne funkcionalnosti Calendre* → *Spletno naročanje*.
2. Booking landing page `/narocanje`, `/en/booking` → hero screenshot.

## Deployment configuration

The asset is stored in the Git repository and copied to `dist/videos/` by the Vite build.
`VITE_BOOKING_DEMO_VIDEO_URL=/videos/calendra-spletno-narocanje.mp4` is the default in the
component, Dockerfile, docker-compose.yml and .env.example. **No manual .env
change is required for the normal Docker Compose deployment.**

To deploy, merge the approved PR into `main` and follow the normal website rebuild and deployment process.
Merging a PR alone does not necessarily redeploy the running Caddy/Docker website.

To temporarily disable the video, configure
`VITE_BOOKING_DEMO_VIDEO_URL=off` in the website build environment
and rebuild the website image. A disabled video falls back to the original WebP screenshots.

## How it works

- Existing WebP images remain the poster and LCP content on both pages.
- The MP4 and the lazy video player load only after someone clicks Play.
- The browser player supports controls, pause, seeking, and closing with X, Escape or the backdrop.
- The video is narrated in Slovenian; the English page labels this.
- The file is about 1.3 MB and served as a static asset; no third-party video scripts.

## Release verification

1. Confirm `GET /videos/calendra-spletno-narocanje.mp4` returns 200 with `video/mp4` after deploying.
2. Confirm browsers can seek (range support), play with audio, and close playback.
3. Verify both locations in Slovenian and English.
4. Verify the hero's other CTAs and the interactive screenshot zoom remain functional.
5. Confirm the release image built from latest `main` is actually deployed before considering this live.
