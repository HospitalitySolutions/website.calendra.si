import { lazy, Suspense, useState } from "react";
import { Play } from "lucide-react";
import type { SiteLanguage } from "@/lib/site-language";

const BookingVideoLightbox = lazy(() => import("./BookingVideoLightbox"));

type BookingDemoVideoProps = {
  language: SiteLanguage;
  placement: "homepage_feature" | "booking_page_hero";
  posterSrc: string;
  posterAlt: string;
  width: number;
  height: number;
  srcSet?: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  imageClassName?: string;
  className?: string;
};

/**
 * Keep the existing marketing screenshots as lightweight posters. This module
 * imports no player and downloads no MP4 until the visitor clicks Play.
 *
 * The video URL is intentionally configured at build time, rather than
 * pointing to a missing public file. Until the final video is hosted and the
 * URL is set, the original image remains in place with no broken play button.
 */
export const getBookingDemoVideoUrl = () => {
  const configured = (import.meta.env.VITE_BOOKING_DEMO_VIDEO_URL || "").trim();
  return configured.startsWith("/") || configured.startsWith("https://")
    ? configured
    : "";
};

const BookingDemoVideo = ({
  language,
  placement,
  posterSrc,
  posterAlt,
  width,
  height,
  srcSet,
  sizes,
  loading = "lazy",
  imageClassName = "",
  className = "",
}: BookingDemoVideoProps) => {
  const [open, setOpen] = useState(false);
  const videoUrl = getBookingDemoVideoUrl();
  const isSlovenian = language === "sl";
  const title = isSlovenian
    ? "Spletno naročanje – predstavitev (44 s)"
    : "Online booking – video tour (Slovenian audio, 44 sec)";
  const image = (
    <img
      src={posterSrc}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      alt={videoUrl ? "" : posterAlt}
      className={imageClassName}
    />
  );

  return (
    <>
      {videoUrl ? (
        <button
          type="button"
          className={`group relative block max-w-full overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/45 focus-visible:ring-offset-2 ${className}`.trim()}
          aria-haspopup="dialog"
          aria-label={title}
          onClick={() => setOpen(true)}
        >
          {image}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-colors duration-200 group-hover:bg-slate-900/10 group-focus-visible:bg-slate-900/10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-primary text-white shadow-lg ring-4 ring-white/65 transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16">
              <Play aria-hidden="true" className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7" />
            </span>
          </span>
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
            {isSlovenian ? "Oglejte si video · 44 s" : "Watch video · 44 sec (SL audio)"}
          </span>
        </button>
      ) : image}
      {open && videoUrl && (
        <Suspense fallback={<div role="status" className="sr-only">{isSlovenian ? "Odpiranje videa" : "Opening video"}</div>}>
          <BookingVideoLightbox
            src={videoUrl}
            language={language}
            placement={placement}
            title={title}
            poster={posterSrc}
            onClose={() => setOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default BookingDemoVideo;
