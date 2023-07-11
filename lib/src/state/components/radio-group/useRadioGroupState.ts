import { Dispatch, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { Action, reducer } from "./reducer";
import { InitialRadioGroupState, RadioGroupState } from "./state";

export type RadioGroupHookOptions = {
  initialState?: InitialRadioGroupState;
};

/**
 * useRadioGroupState is a hook that creates and manages a RadioGroup's state on the
 * Airplane context
 */
export const useRadioGroupState = (
  id: string,
  options?: RadioGroupHookOptions,
): { state: RadioGroupState; dispatch: Dispatch<Action> } => {
  const initialState = {
    value: options?.initialState?.value ?? undefined,
    disabled: options?.initialState?.disabled ?? false,
  };
  const [internalState, dispatch] = useReducer(reducer, {
    ...initialState,
    showErrors: false,
    errors: [],
  });
  const stateSetters = useStateSetters(dispatch, initialState);

  const state: RadioGroupState = useMemo(
    () => ({
      ...internalState,
      ...stateSetters,
      id,
      componentType: ComponentType.RadioGroup,
    }),
    [internalState, id, stateSetters],
  );
  useSyncComponentState(id, state);

  return { state, dispatch };
};
