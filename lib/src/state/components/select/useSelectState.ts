import { Dispatch, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { Action, reducer } from "./reducer";
import { InitialSelectState, SelectState } from "./state";

export type SelectHookOptions = {
  initialState?: InitialSelectState;
};

/**
 * useSelectState is a hook that creates and manages a Select's state on the
 * Airplane context
 */
export const useSelectState = (
  id: string,
  options?: SelectHookOptions,
): { state: SelectState; dispatch: Dispatch<Action> } => {
  const initialState = {
    value: options?.initialState?.value,
    disabled: options?.initialState?.disabled ?? false,
  };
  const [internalState, dispatch] = useReducer(reducer, {
    ...initialState,
    showErrors: false,
    errors: [],
  });
  const stateSetters = useStateSetters(dispatch, initialState);

  const state: SelectState = useMemo(
    () => ({
      ...internalState,
      ...stateSetters,
      id,
      componentType: ComponentType.Select,
    }),
    [internalState, id, stateSetters],
  );
  useSyncComponentState(id, state);

  return { state, dispatch };
};
