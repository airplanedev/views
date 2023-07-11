import { Dispatch, useCallback, useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { Action, reducer } from "./reducer";
import { InitialTextInputState, TextInputState } from "./state";

export type InputHookOptions = {
  initialState?: InitialTextInputState;
  focus?: () => void;
};

/**
 * getUseInputState returns a hook that creates and manages state for TextInput,
 * Textarea, or CodeInput on the Airplane context
 */
export const getUseTextInputState =
  (
    componentType:
      | ComponentType.TextInput
      | ComponentType.Textarea
      | ComponentType.CodeInput,
  ) =>
  (
    id: string,
    options?: InputHookOptions,
  ): { state: TextInputState; dispatch: Dispatch<Action> } => {
    const initialState = {
      value: options?.initialState?.value ?? "",
      disabled: options?.initialState?.disabled ?? false,
    };
    const [internalState, dispatch] = useReducer(reducer, {
      ...initialState,
      showErrors: false,
      errors: [],
    });
    const stateSetters = useStateSetters(dispatch, initialState);

    const f = options?.focus;
    const focus: TextInputState["focus"] = useCallback(() => {
      if (f) f();
    }, [f]);

    const state: TextInputState = useMemo(
      () => ({
        ...internalState,
        ...stateSetters,
        id,
        focus,
        componentType,
      }),
      [internalState, id, focus, stateSetters],
    );
    useSyncComponentState(id, state);

    return { state, dispatch };
  };

export const useTextInputState = getUseTextInputState(ComponentType.TextInput);
export const useTextareaState = getUseTextInputState(ComponentType.Textarea);
export const useCodeInputState = getUseTextInputState(ComponentType.CodeInput);
