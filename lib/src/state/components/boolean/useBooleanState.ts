import { Dispatch, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { useSyncComponentState, ComponentType } from "state/context/context";

import { Action, reducer } from "./reducer";
import { BooleanState, InitialBooleanState } from "./state";

export type BooleanHookOptions = {
  initialState?: InitialBooleanState;
};

export const getUseBooleanState =
  (componentType: ComponentType.Switch | ComponentType.Checkbox) =>
  (
    id: string,
    options?: BooleanHookOptions,
  ): { state: BooleanState; dispatch: Dispatch<Action> } => {
    const initialState = {
      value: options?.initialState?.value ?? false,
      disabled: options?.initialState?.disabled ?? false,
    };
    const [internalState, dispatch] = useReducer(reducer, {
      ...initialState,
      showErrors: false,
      errors: [],
    });
    const stateSetters = useStateSetters(dispatch, initialState);

    const state: BooleanState = useMemo(
      () => ({
        ...internalState,
        ...stateSetters,
        checked: internalState.value || false,
        setChecked: stateSetters.setValue,
        id,
        componentType,
      }),
      [internalState, id, stateSetters],
    );
    useSyncComponentState(id, state);

    return { state, dispatch };
  };

export const useSwitchState = getUseBooleanState(ComponentType.Switch);
export const useCheckboxState = getUseBooleanState(ComponentType.Checkbox);
