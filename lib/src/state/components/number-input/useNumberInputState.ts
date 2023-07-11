import { Dispatch, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { Action, reducer } from "./reducer";
import { InitialNumberInputState, NumberInputState } from "./state";

export type InputHookOptions = {
  initialState?: InitialNumberInputState;
  focus?: () => void;
  min?: number;
  max?: number;
};

const clipMinAndMax = (
  value?: number,
  min?: number,
  max?: number,
): number | undefined => {
  if (value === undefined) {
    return value;
  } else if (min !== undefined && value < min) {
    return min;
  } else if (max !== undefined && value > max) {
    return max;
  } else {
    return value;
  }
};

/**
 * getUseNumberInputState returns hook that creates and manages state
 * for NumberInput or Slider on the Airplane context
 */
export const getUseNumberInputState =
  (componentType: ComponentType.NumberInput | ComponentType.Slider) =>
  (
    id: string,
    options?: InputHookOptions,
  ): { state: NumberInputState; dispatch: Dispatch<Action> } => {
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

    const state: NumberInputState = useMemo(
      () => ({
        ...internalState,
        ...stateSetters,
        setValue: (v) =>
          stateSetters.setValue(clipMinAndMax(v, options?.min, options?.max)),
        id,
        componentType,
      }),
      [internalState, id, stateSetters, options?.min, options?.max],
    );
    useSyncComponentState(id, state);

    return { state, dispatch };
  };

export const useNumberInputState = getUseNumberInputState(
  ComponentType.NumberInput,
);
export const useSliderState = getUseNumberInputState(ComponentType.Slider);
