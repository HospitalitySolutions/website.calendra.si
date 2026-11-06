import { getGoogleAnalyticsConsent } from "@/lib/google-analytics";
import { isBusinessRegistrationUrl } from "@/lib/routes";

export type Language = "sl" | "en";

export const isVisible = (element: Element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
export const isInsideInvitation = (node: unknown) => node instanceof Element && Boolean(node.closest("[data-demo-invitation]"));
export const hasBlockingInterface = () => getGoogleAnalyticsConsent() === null || Array.from(document.querySelectorAll(
  '[role="dialog"], [aria-modal="true"], dialog[open], [data-demo-invitation-blocker="true"]',
)).some(element => !element.closest("[data-demo-invitation]") && isVisible(element));

export const hasMobileCtaCollision = () => {
  if (window.innerHeight < 480) return true;
  const bannerTop = document.querySelector('[data-demo-invitation="mobile"]')?.getBoundingClientRect().top ?? window.innerHeight - 230;
  return Array.from(document.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("main a[href], main button[type=submit]")).some(element => {
    const href = element.getAttribute("href") || "";
    const isPrimary = element.tagName === "BUTTON" || isBusinessRegistrationUrl(href) || ["/predstavitev", "/en/demo"].includes(href);
    const box = element.getBoundingClientRect();
    return isPrimary && isVisible(element) && box.bottom > bannerTop && box.top < window.innerHeight;
  });
};
