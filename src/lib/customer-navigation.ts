import { CUSTOMER_MARKETPLACE_PUBLIC } from "@/lib/customer-marketplace";
import { getRoutePath } from "@/lib/localized-routes";

/**
 * Routes that show the customer marketplace navigation (CustomerNavbar) instead
 * of the business site. Never true while the public marketplace is disabled:
 * CustomerNavbar links to /za-stranke and /en/for-customers, which then 404.
 */
export const isCustomerNavigationPath = (pathname: string): boolean => {
  if (!CUSTOMER_MARKETPLACE_PUBLIC) return false;
  const exact = (["customers", "connect", "businesses"] as const)
    .flatMap((key) => [getRoutePath(key, "sl"), getRoutePath(key, "en")]);
  const prefixes = (["customers", "businesses"] as const)
    .flatMap((key) => [`${getRoutePath(key, "sl")}/`, `${getRoutePath(key, "en")}/`]);
  return exact.includes(pathname) || prefixes.some((prefix) => pathname.startsWith(prefix));
};
