/**
 * Public consumer marketplace rollout switch.
 *
 * Development stays enabled by default for local testing. Production builds
 * stay private until CUSTOMER_MARKETPLACE_PUBLIC=true is supplied at build and
 * runtime.
 */
const configuredValue = import.meta.env.VITE_CUSTOMER_MARKETPLACE_PUBLIC;

export const CUSTOMER_MARKETPLACE_PUBLIC = configuredValue === "true"
  || (configuredValue == null && !import.meta.env.PROD);
