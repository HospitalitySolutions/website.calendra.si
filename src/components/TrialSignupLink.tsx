import { forwardRef, type AnchorHTMLAttributes } from "react";
import { useRegistrationSearch } from "@/lib/use-registration-search";
import { buildTrialSignupRoute } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";

/** A regular document navigation to the separately served registration application. */
export const TrialSignupLink = forwardRef<HTMLAnchorElement, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">>(
  (props, ref) => {
    const { language } = useSiteLanguage();
    const search = useRegistrationSearch();
    return <a {...props} ref={ref} href={buildTrialSignupRoute(language, search)} />;
  },
);
TrialSignupLink.displayName = "TrialSignupLink";
