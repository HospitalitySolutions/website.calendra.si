import { Apple, Play } from "lucide-react";
import { getCalendraConnectCopy } from "@/lib/calendra-connect";
import { APP_STORE_APP_URL, GOOGLE_PLAY_APP_URL } from "@/lib/calendra-connect-config";
import { useSiteLanguage } from "@/lib/site-language";

type StoreButtonProps = {
  href?: string;
  topLabel: string;
  storeLabel: string;
  comingSoon: string;
  icon: "apple" | "play";
};

const StoreButton = ({ href, topLabel, storeLabel, comingSoon, icon }: StoreButtonProps) => {
  const Icon = icon === "apple" ? Apple : Play;
  const content = (
    <>
      <Icon className="h-7 w-7 shrink-0" aria-hidden="true" />
      <span className="min-w-0 text-left">
        <span className="block text-[0.65rem] font-medium leading-tight text-white/70">{href ? topLabel : comingSoon}</span>
        <span className="block truncate text-base font-bold leading-tight text-white">{storeLabel}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span className="inline-flex min-w-[180px] cursor-not-allowed items-center gap-3 rounded-2xl bg-foreground px-5 py-3 opacity-65" aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex min-w-[180px] items-center gap-3 rounded-2xl bg-foreground px-5 py-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {content}
    </a>
  );
};

const StoreButtons = ({ className = "" }: { className?: string }) => {
  const { language } = useSiteLanguage();
  const copy = getCalendraConnectCopy(language).stores;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      <StoreButton href={APP_STORE_APP_URL} topLabel={copy.appStoreTop} storeLabel={copy.appStore} comingSoon={copy.comingSoon} icon="apple" />
      <StoreButton href={GOOGLE_PLAY_APP_URL} topLabel={copy.googlePlayTop} storeLabel={copy.googlePlay} comingSoon={copy.comingSoon} icon="play" />
    </div>
  );
};

export default StoreButtons;
