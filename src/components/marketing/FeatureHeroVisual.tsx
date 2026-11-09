import { useRef } from "react";
import { MousePointerClick, X, ZoomIn } from "lucide-react";
import type { SiteLanguage } from "@/lib/site-language";

type FeatureHeroScreenshot = {
  src: string;
  srcSet?: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

type FeatureHeroVisualProps = {
  screenshot: FeatureHeroScreenshot;
  language: SiteLanguage;
};

/** Tallest the framed screenshot may render in the hero. */
const MAX_FRAME_IMAGE_HEIGHT = 540;
/** The hero thumbnail is cropped from the top-left to an aspect between these
 * bounds, so portrait screens are not too tall and very wide ones (inventory)
 * are not too small to read. The dialog always shows the whole screenshot. */
const MIN_FRAME_ASPECT = 1;
const MAX_FRAME_ASPECT = 1.6;

/**
 * Product visual for the feature-page hero. It reuses the home-page hero's
 * browser frame, hint and caption classes (src/styles/homepage.css, which is
 * part of the global stylesheet), so both heroes stay visually identical.
 * It shows the page's real screenshot only; clicking it opens the same image
 * at full size in a native modal dialog.
 */
const FeatureHeroVisual = ({ screenshot, language }: FeatureHeroVisualProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sl = language === "sl";
  const aspect = Math.min(MAX_FRAME_ASPECT, Math.max(MIN_FRAME_ASPECT, screenshot.width / screenshot.height));
  const frameMaxWidth = Math.round(MAX_FRAME_IMAGE_HEIGHT * aspect);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    // Top-aligned with the headline (lg:pt-24) rather than centred on the long copy column.
    <div className="relative mx-auto flex w-full min-w-0 max-w-[760px] flex-col items-center before:pointer-events-none before:absolute before:inset-[-60px_-80px] before:bg-[radial-gradient(ellipse,hsl(211_100%_96%),transparent_70%)] before:content-[''] lg:max-w-none lg:pt-24">
      <button
        type="button"
        className="home-desktop-frame home-preview-trigger"
        style={{ maxWidth: `min(100%, ${frameMaxWidth}px)` }}
        onClick={open}
        aria-haspopup="dialog"
        aria-label={sl ? `Povečaj posnetek zaslona: ${screenshot.caption}` : `Enlarge screenshot: ${screenshot.caption}`}
      >
        <span className="home-browser-bar" aria-hidden="true"><span /><span /><span /><small>app.calendra.si</small></span>
        <img
          src={screenshot.src}
          srcSet={screenshot.srcSet}
          sizes="(min-width: 1024px) 640px, 92vw"
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          className="object-cover object-left-top"
          style={{ aspectRatio: String(aspect) }}
          decoding="async"
          {...{ fetchpriority: "high" }}
        />
        <span className="home-device-hint" aria-hidden="true"><ZoomIn />{sl ? "Kliknite za povečavo" : "Click to enlarge"}</span>
      </button>
      <p className="home-preview-caption">
        <MousePointerClick aria-hidden="true" />
        {screenshot.caption}
      </p>

      <dialog
        ref={dialogRef}
        className="max-h-[calc(100vh-32px)] w-[min(1180px,calc(100vw-32px))] max-w-none rounded-[18px] border-0 p-2 shadow-2xl backdrop:bg-slate-950/70 sm:p-4"
        aria-label={screenshot.caption}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      >
        <button
          type="button"
          className="absolute right-3.5 top-3.5 grid h-10 w-10 place-items-center rounded-full bg-slate-900/85 text-white sm:right-6 sm:top-6"
          onClick={close}
          aria-label={sl ? "Zapri povečan pogled" : "Close enlarged preview"}
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <img
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          className="mx-auto block h-auto max-h-[calc(100vh-124px)] w-auto max-w-full rounded-[10px]"
          loading="lazy"
          decoding="async"
        />
        <p className="mt-3 text-center text-sm text-muted-foreground">{screenshot.caption}</p>
      </dialog>
    </div>
  );
};

export default FeatureHeroVisual;
