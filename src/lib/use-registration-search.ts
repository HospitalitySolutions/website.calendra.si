import { useSyncExternalStore } from "react";
import { useLocation } from "react-router-dom";

const subscribe = () => () => {};
const serverSearch = () => "";

/** Prerendered pages have no visitor query; apply attribution after hydration. */
export function useRegistrationSearch() {
  const { search } = useLocation();
  return useSyncExternalStore(subscribe, () => search, serverSearch);
}
