import { isEqual } from "lodash-es";

import { runValidate } from "./runValidation";
import { ValidateFnProp } from "./types";

export type InputState<TValue> = {
  value?: TValue;
  disabled: boolean;
  errors: string[];
  showErrors: boolean;
};

export type InputAction<TValue> =
  | { type: "setValue"; value: TValue }
  | { type: "setDisabled"; disabled?: boolean }
  | { type: "validate"; required?: boolean; validate?: ValidateFnProp<TValue> }
  | { type: "setShowErrors"; showErrors: boolean }
  | { type: "reset"; initialValue: TValue; initialDisabled: boolean };

export const inputReducer = <TValue>(
  state: InputState<TValue>,
  action: InputAction<TValue>,
): InputState<TValue> => {
  switch (action.type) {
    case "setValue": {
      const { value } = action;
      return { ...state, value };
    }
    case "setDisabled": {
      let { disabled } = action;
      if (disabled == null) disabled = true;
      return { ...state, disabled };
    }
    case "validate": {
      const { required, validate } = action;
      const { value, errors } = state;
      const newErrors = runValidate(value, { required, validate });
      if (isEqual(errors, newErrors)) {
        return state;
      } else {
        return { ...state, errors: newErrors };
      }
    }
    case "setShowErrors": {
      const { showErrors } = action;
      if (showErrors === state.showErrors) {
        return state;
      }
      return { ...state, showErrors };
    }
    case "reset": {
      const { initialValue, initialDisabled } = action;
      return {
        value: initialValue,
        disabled: initialDisabled,
        errors: [],
        showErrors: false,
      };
    }
    default:
      throw new Error("invalid action");
  }
};
