import { cn } from "@/lib/utils";

/**
 * The large faded numeral in the corner of a numbered step card.
 *
 * The digits are rendered through a pseudo-element rather than as text nodes:
 * at 8% opacity they are decoration, but as real text they read to contrast
 * checkers as body copy at a 1.1:1 ratio. The step order is already carried by
 * the surrounding list, so nothing is lost by hiding them from the tree.
 */
const StepWatermark = ({ index, className }: { index: number; className?: string }) => (
  <span
    aria-hidden="true"
    data-step={String(index + 1).padStart(2, "0")}
    className={cn(
      "pointer-events-none absolute font-display font-black text-primary/[0.08] before:content-[attr(data-step)]",
      className,
    )}
  />
);

export { StepWatermark };
