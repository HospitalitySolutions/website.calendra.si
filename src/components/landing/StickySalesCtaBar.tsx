import { Button } from "@/components/ui/button";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import { useEffect, useState, type RefObject } from "react";

type StickySalesCtaBarProps = {
  anchorRef?: RefObject<HTMLElement | null>;
  placement: string;
  threshold?: number;
};

const StickySalesCtaBar = ({ anchorRef, placement, threshold = 420 }: StickySalesCtaBarProps) => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).hero;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frame = 0;
    const updateVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchorBottom = anchorRef?.current?.getBoundingClientRect().bottom;
        const shouldShow = typeof anchorBottom === "number"
          ? anchorBottom < 0
          : window.scrollY > threshold;
        setIsVisible(shouldShow);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [anchorRef, threshold]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto grid max-w-[720px] gap-2 rounded-2xl border border-border/70 bg-background/95 p-2.5 shadow-[0_24px_70px_-24px_hsl(220_35%_10%/0.45)] backdrop-blur-xl sm:grid-cols-2">
        <Button
          variant="hero"
          size="lg"
          className="h-12 w-full rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/20 sm:text-base"
          asChild
        >
          <a
            href={TRIAL_SIGNUP_ROUTE}
            onClick={() => trackMarketingEvent("trial_cta_click", { placement: `${placement}_sticky`, language })}
          >
            {copy.primaryCta}
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full rounded-xl border-border/80 bg-card px-5 text-sm font-semibold text-primary shadow-sm hover:border-primary/30 hover:bg-card hover:text-primary sm:text-base"
          asChild
        >
          <a
            href={getRoutePath("demo", language)}
            onClick={() => trackMarketingEvent("demo_booking_cta_clicked", { placement: `${placement}_sticky`, language })}
          >
            <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
            {copy.secondaryCta}
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default StickySalesCtaBar;
