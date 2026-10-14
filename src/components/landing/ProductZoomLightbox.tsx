import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import "./product-zoom.css";

export type PreviewDevice = "desktop" | "mobile";
export type PreviewBounds = { left: number; top: number; width: number; height: number };

type ProductZoomLightboxProps = {
  device: PreviewDevice;
  origin: PreviewBounds;
  language: "sl" | "en";
  onClose: () => void;
};

const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

/** The target is laid out at its full size; animate its transform from the
 * clicked thumbnail's viewport rectangle (FLIP), then reverse on close.
 * Images stay static: no mock data, API calls, or duplicated calendar UI.
 */
const originTransform = (origin: PreviewBounds, target: DOMRect): string => {
  if (target.width <= 0 || target.height <= 0 || origin.width <= 0 || origin.height <= 0) {
    return "none";
  }
  return `translate3d(${origin.left - target.left}px, ${origin.top - target.top}px, 0) scale(${origin.width / target.width}, ${origin.height / target.height})`;
};

const ProductZoomLightbox = ({ device, origin, language, onClose }: ProductZoomLightboxProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const enterAnimation = useRef<Animation | null>(null);
  const originRef = useRef(origin);

  const sl = language === "sl";
  const title = device === "desktop"
    ? (sl ? "Povečan pogled računalniškega koledarja Calendra" : "Enlarged Calendra desktop calendar")
    : (sl ? "Povečan pogled mobilnega koledarja Calendra" : "Enlarged Calendra mobile calendar");
  const closeLabel = sl ? "Zapri povečan pogled" : "Close enlarged preview";

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    enterAnimation.current?.cancel();

    const frame = frameRef.current;
    const overlay = overlayRef.current;
    if (!frame || !overlay || getReducedMotion() || typeof frame.animate !== "function") {
      onClose();
      return;
    }

    const target = frame.getBoundingClientRect();
    const finishTransform = originTransform(originRef.current, target);
    if (finishTransform === "none") {
      onClose();
      return;
    }

    overlay.animate(
      [{ backgroundColor: "rgba(12, 24, 45, 0.73)" }, { backgroundColor: "rgba(12, 24, 45, 0)" }],
      { duration: 260, easing: "ease-in", fill: "forwards" },
    );
    const closing = frame.animate(
      [{ transform: "none", opacity: 1 }, { transform: finishTransform, opacity: 0.95 }],
      { duration: 260, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    );
    void closing.finished.then(onClose, onClose);
  }, [onClose]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || getReducedMotion() || typeof frame.animate !== "function") return;
    const target = frame.getBoundingClientRect();
    const startTransform = originTransform(originRef.current, target);
    if (startTransform === "none") return;

    const animation = frame.animate(
      [{ transform: startTransform, opacity: 0.97 }, { transform: "none", opacity: 1 }],
      { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
    );
    enterAnimation.current = animation;
    void animation.finished.then(() => {
      if (enterAnimation.current === animation) {
        animation.cancel();
        enterAnimation.current = null;
      }
    }, () => {});
    return () => {
      animation.cancel();
      if (enterAnimation.current === animation) enterAnimation.current = null;
    };
  }, [device]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
      // The close button is the only focusable element. Keep Tab inside the modal.
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [requestClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="product-zoom-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <button
        type="button"
        className="product-zoom-close"
        ref={closeRef}
        aria-label={closeLabel}
        onClick={requestClose}
      >
        <X aria-hidden="true" />
      </button>

      <div className="product-zoom-stage">
        <div
          className={`product-zoom-frame product-zoom-frame-${device}`}
          ref={frameRef}
        >
          {device === "desktop" && (
            <div className="home-browser-bar" aria-hidden="true">
              <span /><span /><span /><small>app.calendra.si</small>
            </div>
          )}
          <img
            src={device === "desktop"
              ? "/homepage/calendar-desktop.webp"
              : "/homepage/calendar-mobile.webp"}
            alt={title}
            width={device === "desktop" ? 1912 : 367}
            height={device === "desktop" ? 914 : 819}
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
      <p className="product-zoom-description" aria-hidden="true">
        {sl ? "Posnetek zaslona aplikacije Calendra" : "Screenshot of the Calendra app"}
      </p>
    </div>,
    document.body,
  );
};

export default ProductZoomLightbox;
