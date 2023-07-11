import { Switch as MantineSwitch, createStyles } from "@mantine/core";
import * as React from "react";
import { ChangeEvent, forwardRef, useCallback } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useSwitchState } from "state/components/boolean/useBooleanState";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";

import { SwitchComponentProps, SwitchProps } from "./Switch.types";
import { useComponentId } from "../../state/components/useId";

export const useStyles = createStyles((theme) => ({
  label: { color: theme.colors.gray[7] },
}));

/** Presentational switch component */
export const SwitchComponent = forwardRef(
  (
    { width, ...props }: SwitchComponentProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { classes } = useStyles();
    const propsOnChange = props.onChange;
    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        propsOnChange?.(e.currentTarget.checked);
      },
      [propsOnChange],
    );
    return (
      <MantineSwitch
        classNames={classes}
        {...props}
        ref={ref}
        onChange={onChange}
      />
    );
  },
);
SwitchComponent.displayName = "SwitchComponent";

export const Switch = forwardRef(
  (props: SwitchProps, ref: React.Ref<HTMLInputElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <SwitchWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  ),
);
const DISPLAY_NAME = "Switch";
Switch.displayName = DISPLAY_NAME;

/** Exported for documentation purposes */
export const SwitchWithoutRef = (
  props: SwitchProps & { innerRef: React.Ref<HTMLInputElement> },
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useSwitchState(id, {
    initialState: {
      value: props.checked ?? props.defaultChecked,
      disabled: props.disabled ?? props.defaultDisabled,
    },
  });
  const { inputProps } = useInput(props, state, dispatch, (v: boolean) => v);

  const { value: checked, ...restInputProps } = inputProps;
  const { innerRef, validate: _, onChange: __, ...restProps } = props;
  useRegisterFormInput(id, "switch");
  return (
    <SwitchComponent
      checked={checked}
      ref={innerRef}
      {...restInputProps}
      {...restProps}
    />
  );
};
