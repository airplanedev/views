import { Dispatch, useCallback, useMemo } from "react";

import { InputAction } from "./reducer";

export type StateSetters<TValue> = {
  setValue: (value: TValue) => void;
  setDisabled: (disabled?: boolean) => void;
  setShowErrors: (showErrors: boolean) => void;
  reset: () => void;
};

export const useStateSetters = <TValue>(
  dispatch: Dispatch<InputAction<TValue>>,
  initialState: { value: TValue; disabled: boolean },
): StateSetters<TValue> => {
  const setValue = useCallback(
    (value: TValue) => {
      dispatch({
        type: "setValue",
        value,
      });
    },
    [dispatch],
  );

  const setDisabled = useCallback(
    (disabled?: boolean) => {
      dispatch({
        type: "setDisabled",
        disabled,
      });
    },
    [dispatch],
  );

  const setShowErrors = useCallback(
    (showErrors: boolean) => {
      dispatch({
        type: "setShowErrors",
        showErrors,
      });
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch({
      type: "reset",
      initialValue: initialState.value,
      initialDisabled: initialState.disabled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initialState cannot change.
  }, [dispatch]);

  return useMemo(
    () => ({
      setValue,
      setDisabled,
      setShowErrors,
      reset,
    }),
    [setValue, setDisabled, setShowErrors, reset],
  );
};
