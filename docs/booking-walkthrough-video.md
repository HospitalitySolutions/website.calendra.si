# Calendra online-booking walkthrough video

This feature places a **click-to-play video preview** in two public website locations:
- The "Spletno naročanje" card in "Ključne funkcionalnosti Calendre" on `/` and `/en`.
- The hero image on `/narocanje` and `/en/booking`.

Both places use the **same video player**, with the existing screenshots serving as lightweight posters. No MP4 is requested until visitors click Play. The video opens in a dialog with native playback controls, Escape/backdrop/X closing, and keyboard access.

## Supply the media asset (required before launch)

Source supplied by the product team: `Calendra_spletno_narocanje.mp4`, H.264/AAC, 1920 × 1080, 44 seconds, about 4.6 MB.

Preferred option for this single short file: store it as a static website asset:

1. Put the file at **`public/videos/calendra-spletno-narocanje.mp4`** in this repo (create `public/videos` if needed).
2. Set the build-time variable **`VITE_BOOKING_DEMO_VIDEO_URL=/videos/calendra-spletno-narocanje.mp4`**.
3. Rebuild/redeploy the website image on the normal release process.
4. Verify `https://calendra.si/videos/calendra-spletno-narocanje.mp4` serves `200 OK` with `Content-Type: video/mp4` and supports seeking/range requests.
5. Test on desktop and mobile: click the screenshot in both locations, play the video, seek, close with X/escape/backdrop, navigate away, and check that playback stops.

For a larger library of videos, use permanent HTTPS video/CDN hosting and set the URL to the hosted MP4 instead of checking it into the repository. **Do not use expiring signed links or a Google Drive preview URL** as the final video source.

### Safety during rollout

If `VITE_BOOKING_DEMO_VIDEO_URL` is absent/empty, the website falls back to the existing screenshots and does not show broken play buttons. This deliberately keeps production usable until the MP4 has been uploaded and verified.

The variable is a **Vite build-time value**, not a runtime Docker environment variable. Updating it requires rebuilding the image. `docker-compose.yml` and `Dockerfile` forward it into the build.

### Language note

The supplied recording has Slovenian narration. The English site currently offers the same video and marks it as Slovenian audio; an English narration/subtitle track can be added later.

### Performance

- The original WebP posters are loaded as before.
- The modal is a lazy-loaded React chunk and is not mounted until requested.
- `<video>` and its `<source>` are absent from page markup until the click.
- Playback starts in the native browser player with controls and `preload="metadata"`; download only starts after opening.
- No third-party players, tracking libraries or autoplay video are added to initial page load.
