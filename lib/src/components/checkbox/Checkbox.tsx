import { Checkbox as MantineCheckbox } from "@mantine/core";
import * as React from "react";
import { ChangeEvent, forwardRef, useCallback } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCheckboxState } from "state/components/boolean/useBooleanState";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useComponentId } from "state/components/useId";

import { CheckboxComponentProps, CheckboxProps } from "./Checkbox.types";

/** Presentational checkbox component */
export const CheckboxComponent = forwardRef(
  (
    { width, ...props }: CheckboxComponentProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const propsOnChange = props.onChange;
    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        propsOnChange?.(e.currentTarget.checked);
      },
      [propsOnChange]
    );
    return <MantineCheckbox {...props} ref={ref} onChange={onChange} />;
  }
);
CheckboxComponent.displayName = "CheckboxComponent";

export const Checkbox = forwardRef(
  (props: CheckboxProps, ref: React.Ref<HTMLInputElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <CheckboxWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  )
);
const DISPLAY_NAME = "Checkbox";
Checkbox.displayName = DISPLAY_NAME;

/** Exported for documentation purposes */
export const CheckboxWithoutRef = (
  props: CheckboxProps & { innerRef: React.Ref<HTMLInputElement> }
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useCheckboxState(id, {
    initialState: {
      value: props.checked ?? props.defaultChecked,
      disabled: props.disabled ?? props.defaultDisabled,
    },
  });
  const { inputProps } = useInput(props, state, dispatch, (v: boolean) => v);
  useRegisterFormInput(id, "checkbox");

  const { value: checked, ...restInputProps } = inputProps;
  const { innerRef, validate: _, onChange: __, ...restProps } = props;
  return (
    <CheckboxComponent
      checked={checked}
      ref={innerRef}
      {...restInputProps}
      {...restProps}
    />
  );
};
