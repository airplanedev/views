import { ValidateFn, ValidateFnProp, InputProps } from "./types";

export const REQUIRED_ERROR = "This field is required";

/**
 * runValidate runs all the validation functions and returns an array of errors.
 */
export const runValidate = <TValue>(
  value: TValue | null | undefined,
  { validate, required }: InputProps<TValue, unknown>,
): string[] => {
  const errors: string[] = [];
  if (required) {
    if (value == null || isEmptyValue(value)) {
      errors.push(REQUIRED_ERROR);
    }
  }
  if (validate != null && value != null && !isEmptyValue(value)) {
    const validateFns = unpackValidateProp(validate);
    for (const validateFn of validateFns) {
      const error = validateFn(value);
      if (error != null && error.length > 0) {
        errors.push(error);
      }
    }
  }
  return errors;
};

const unpackValidateProp = <TValue>(
  validateFn: ValidateFnProp<TValue>,
): Array<ValidateFn<TValue>> => {
  if (Array.isArray(validateFn)) {
    return validateFn;
  } else {
    return [validateFn];
  }
};

const isEmptyValue = <TValue>(value: TValue): boolean => {
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};
