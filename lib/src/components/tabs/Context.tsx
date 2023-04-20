import { createContext } from "react";

import type { TabsValue } from "state/components/tabs/state";

/** TabsContext provides descendants information about their containing tab. */
export const TabsContext = createContext<{
  activeTab: TabsValue;
  tab: TabsValue;
  isActive: boolean;
}>({
  tab: null,
  activeTab: null,
  isActive: false,
});
