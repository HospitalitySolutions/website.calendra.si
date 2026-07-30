import { WORDMARK } from "@/lib/brand-assets";

const CalendraConnectLogo = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex flex-col items-start ${className}`.trim()} aria-label="Calendra Connect">
    <img
      src={WORDMARK.src}
      alt=""
      width={WORDMARK.width}
      height={WORDMARK.height}
      className="h-auto w-full"
      aria-hidden="true"
    />
    <span className="ml-[39%] -mt-[1%] font-display text-[clamp(1.5rem,4vw,3.2rem)] font-bold leading-none text-accent">
      Connect
    </span>
  </div>
);

export default CalendraConnectLogo;
