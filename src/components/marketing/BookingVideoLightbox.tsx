import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { SiteLanguage } from "@/lib/site-language";

type BookingVideoLightboxProps = {
  src: string;
  poster: string;
  language: SiteLanguage;
  placement: "homepage_feature" | "booking_page_hero";
  title: string;
  onClose: () => void;
};

const BookingVideoLightbox = ({
  src,
  poster,
  language,
  title,
  onClose,
}: BookingVideoLightboxProps) => {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const sl = language === "sl";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const focusable = [closeRef.current, videoRef.current].filter(Boolean) as HTMLElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      videoRef.current?.pause();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  // React SSR never renders the portal. The poster remains server-rendered for
  // search engines, and the real video player is only mounted after a click.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-8"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl rounded-xl border border-white/20 bg-slate-950 p-2 shadow-2xl sm:rounded-2xl sm:p-3">
        <div className="mb-2 flex min-h-10 items-center justify-between gap-3 px-1 sm:mb-3">
          <h2 id={titleId} className="text-sm font-semibold leading-snug text-white sm:text-lg">{title}</h2>
          <button
            type="button"
            ref={closeRef}
            aria-label={sl ? "Zapri video" : "Close video"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <video
          ref={videoRef}
          data-testid="booking-demo-player"
          className="aspect-video w-full rounded-lg bg-black"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={title}
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
          {sl ? "Vaš brskalnik ne podpira predvajanja videoposnetkov." : "Your browser does not support video playback."}
        </video>
        {failed && (
          <p role="alert" className="mt-2 px-1 text-sm text-amber-200">
            {sl
              ? "Videoposnetka trenutno ni mogoče predvajati. Poskusite znova pozneje."
              : "This video could not be played. Please try again later."}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BookingVideoLightbox;
