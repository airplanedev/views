import { Dispatch, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { Action, reducer } from "./reducer";
import { InitialMultiSelectState, MultiSelectState } from "./state";

export type MultiSelectHookOptions = {
  initialState?: InitialMultiSelectState;
};

const INITIAL_VALUE: (string | number)[] = [];

/**
 * useMultiSelectState is a hook that creates and manages a MultiSelect's state on the
 * Airplane context
 */
export const useMultiSelectState = (
  id: string,
  options?: MultiSelectHookOptions,
): { state: MultiSelectState; dispatch: Dispatch<Action> } => {
  const initialState = {
    value: options?.initialState?.value ?? INITIAL_VALUE,
    disabled: options?.initialState?.disabled ?? false,
  };
  const [internalState, dispatch] = useReducer(reducer, {
    ...initialState,
    showErrors: false,
    errors: [],
  });
  const stateSetters = useStateSetters(dispatch, initialState);

  const state: MultiSelectState = useMemo(
    () => ({
      ...internalState,
      ...stateSetters,
      id,
      componentType: ComponentType.MultiSelect,
    }),
    [internalState, id, stateSetters],
  );
  useSyncComponentState(id, state);

  return { state, dispatch };
};
