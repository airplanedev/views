import { useCallback, useMemo } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";

import { adaptInputsToValues, useFormInputs } from "./useFormInputs";

/**
 * useFormState is a hook that creates and manages a Form's state on the
 * Airplane context
 */
export const useFormState = (id: string) => {
  const inputData = useFormInputs();

  const reset = useCallback(() => {
    const inputResets = Object.values(inputData).map(
      (input) => input.state.reset,
    );
    for (const inputReset of inputResets) {
      inputReset();
    }
  }, [inputData]);

  const values = useMemo(() => {
    return adaptInputsToValues(inputData);
  }, [inputData]);

  const state = useMemo(
    () => ({
      id,
      values,
      reset,
      componentType: ComponentType.Form,
    }),
    [id, values, reset],
  );
  useSyncComponentState(id, state);

  return state;
};
