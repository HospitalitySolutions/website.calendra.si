/**
 * Single source of truth for the homepage LCP image. The Hero component, the
 * `index.html` preload hint and the prerender preload injection all read from
 * here so the preloaded file can never drift from the rendered one.
 *
 * The variants are produced by `node scripts/optimize-images.mjs`. The hero
 * occupies roughly half the viewport width on desktop and the full width on
 * mobile, which is what `sizes` below describes; getting that wrong is the
 * usual reason a responsive image still downloads the largest file.
 */
const HERO_WIDTHS = [640, 960, 1280, 1920, 2400] as const;

const heroVariant = (width: number) => `/hero/calendra-calendar-aug-2026-${width}.webp`;

export const HERO_IMAGE = {
  src: heroVariant(1280),
  srcSet: HERO_WIDTHS.map((width) => `${heroVariant(width)} ${width}w`).join(", "),
  sizes: "(min-width: 1024px) 46vw, 100vw",
  type: "image/webp",
  width: 2400,
  height: 920,
} as const;
