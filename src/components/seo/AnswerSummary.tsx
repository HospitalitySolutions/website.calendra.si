import { getAnswerForRoute } from "@/lib/answers";
import type { CanonicalRouteKey } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type AnswerSummaryProps = {
  routeKey: CanonicalRouteKey;
  className?: string;
};

/**
 * Renders the page's direct answer immediately under its H1. The
 * `data-speakable="answer"` hook matches the SpeakableSpecification emitted in
 * `src/lib/seo.ts`, so voice assistants and AI crawlers are pointed at the same
 * passage a human reader sees first.
 */
const AnswerSummary = ({ routeKey, className }: AnswerSummaryProps) => {
  const { language } = useSiteLanguage();
  const answer = getAnswerForRoute(routeKey, language);

  if (!answer) return null;

  return (
    <p
      data-speakable="answer"
      className={cn(
        "max-w-3xl rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 text-base leading-7 text-foreground sm:text-lg sm:leading-8",
        className,
      )}
    >
      {answer}
    </p>
  );
};

export default AnswerSummary;
