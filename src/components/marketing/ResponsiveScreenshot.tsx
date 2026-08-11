import type { MarketingImage } from "@/lib/marketing-images";

type ResponsiveScreenshotProps = {
  image: MarketingImage;
  alt: string;
  caption?: string;
  eager?: boolean;
  className?: string;
  imageClassName?: string;
};

const ResponsiveScreenshot = ({
  image,
  alt,
  caption,
  eager = false,
  className = "",
  imageClassName = "",
}: ResponsiveScreenshotProps) => (
  <figure className={`overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft ${className}`.trim()}>
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      alt={alt}
      width={image.width}
      height={image.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`block h-auto w-full ${imageClassName}`.trim()}
    />
    {caption ? <figcaption className="border-t border-border/60 px-5 py-4 text-sm leading-6 text-muted-foreground">{caption}</figcaption> : null}
  </figure>
);

export default ResponsiveScreenshot;
