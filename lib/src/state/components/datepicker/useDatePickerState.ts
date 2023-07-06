import { useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer } from "./reducer";
import { InitialDatePickerState, DatePickerState } from "./state";

export type DatePickerHookOptions = {
  initialState?: InitialDatePickerState;
};

/**
 * useDatePickerState is a hook that creates and manages an DatePicker's state on the
 * Airplane context
 */
export const getUseDatePickerState =
  (componentType: ComponentType.DatePicker | ComponentType.DateTimePicker) =>
  (id: string, options?: DatePickerHookOptions) => {
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

    const state: DatePickerState = useMemo(
      () => ({
        ...internalState,
        ...stateSetters,
        id,
        componentType,
      }),
      [internalState, stateSetters, id],
    );
    useSyncComponentState(id, state);

    return { state, dispatch };
  };

export const useDatePickerState = getUseDatePickerState(
  ComponentType.DatePicker,
);
export const useDateTimePickerState = getUseDatePickerState(
  ComponentType.DateTimePicker,
);
