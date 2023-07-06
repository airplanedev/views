import { useCallback } from "react";

import { useRouter } from "./useRouter";

/**
 * useTabsRouting is an internal hook that makes the Tab read and write to the tab state encoded in the URL.
 */
export const useTabsRouting = (
  routingKey: string | null,
): {
  routerValue: string | undefined;
  navigateTab: (tabValue: string) => void;
} => {
  const router = useRouter();
  const routerValue = routingKey ? router.params[routingKey] : undefined;

  const navigateTab = useCallback(
    (tabValue: string) => {
      if (routingKey) {
        router.navigate({
          params: {
            ...router.params,
            [routingKey]: tabValue,
          },
        });
      }
    },
    [router, routingKey],
  );

  return {
    routerValue,
    navigateTab,
  };
};
