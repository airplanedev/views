import { Dispatch, useCallback, useEffect, useMemo } from "react";

import { InputAction, InputState } from "./reducer";
import { InputProps } from "./types";

/**
 * useInput is a hook that generates props for an input component.
 */
export const useInput = <TValue, TState extends InputState<TValue>, TOnChange>(
  props: InputProps<TValue, TOnChange>,
  state: TState,
  dispatch: Dispatch<InputAction<TValue>>,
  getChangeValue: (v: TOnChange) => TValue,
) => {
  const { value, disabled, showErrors, errors } = state;

  useEffect(() => {
    dispatch({
      type: "validate",
      required: props.required,
      validate: props.validate,
    });
  }, [dispatch, props.required, props.validate, value]);

  const propsOnChange = props.onChange;
  const onChange = useCallback(
    (v: TOnChange) => {
      dispatch({ type: "setValue", value: getChangeValue(v) });
      if (propsOnChange) {
        propsOnChange(v);
      }
    },
    [dispatch, getChangeValue, propsOnChange],
  );

  const inputProps = useMemo(
    () => ({
      error: getErrorMessage(showErrors, errors),
      onChange,
      value,
      disabled,
    }),
    [showErrors, errors, onChange, value, disabled],
  );

  return { inputProps };
};

const getErrorMessage = (
  showErrors: boolean,
  errors: string[],
): string | undefined => {
  if (showErrors && errors.length > 0) {
    return errors.join("\n");
  }
  return undefined;
};
