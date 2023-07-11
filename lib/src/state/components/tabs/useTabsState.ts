import { useCallback, useMemo, useReducer } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer } from "./reducer";
import { InitialTabsState, TabsState, TabsValue } from "./state";

export type TabsHookOptions = {
  initialState?: InitialTabsState;
};

/**
 * useTabsState is a hook that creates and manages a Tabs component's state on the
 * Airplane context
 */
export const useTabsState = (
  id: string,
  options?: TabsHookOptions,
): TabsState => {
  const [internalState, dispatch] = useReducer(reducer, {
    value: options?.initialState?.value,
  });

  const setValue = useCallback((value: TabsValue) => {
    dispatch({
      type: "setValue",
      value,
    });
  }, []);

  const state: TabsState = useMemo(
    () => ({
      id,
      setValue,
      value: internalState.value,
      componentType: ComponentType.Tabs,
    }),
    [id, internalState.value, setValue],
  );
  useSyncComponentState(id, state);

  return state;
};
