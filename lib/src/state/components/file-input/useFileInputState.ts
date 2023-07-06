import { useMemo, useReducer } from "react";

import { useStateSetters } from "state/components/input/useStateSetters";
import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer } from "./reducer";
import { InitialFileInputState, FileInputState } from "./state";

export type FileInputHookOptions = {
  initialState: InitialFileInputState;
};

/**
 * useFileInputState is a hook that creates and manages an FileInput's state on the
 * Airplane context
 */
export const useFileInputState = (
  id: string,
  options: FileInputHookOptions,
) => {
  const initialState = {
    value: options.initialState.initialValue,
    disabled: options.initialState.disabled ?? false,
  };
  const [internalState, dispatch] = useReducer(reducer, {
    ...initialState,
    showErrors: false,
    errors: [],
  });
  const stateSetters = useStateSetters(dispatch, initialState);

  const state: FileInputState = useMemo(
    () => ({
      ...internalState,
      ...stateSetters,
      id,
      componentType: ComponentType.FileInput,
    }),
    [internalState, stateSetters, id],
  );
  useSyncComponentState(id, state);

  return { state, dispatch };
};
