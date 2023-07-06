import { createStyles } from "@mantine/core";
import { DatePicker as MantineDatePicker } from "@mantine/dates";
import React, { forwardRef, Ref } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { useDatePickerState } from "state/components/datepicker/useDatePickerState";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useComponentId } from "state/components/useId";

import { DatePickerProps, DatePickerComponentProps } from "./DatePicker.types";

const useStyles = createStyles((theme) => {
  return {
    weekend: {
      color: `${theme.colors.dark[6]} !important`,
    },
    selected: {
      background: `${theme.colors.primary[5]} !important`,
    },
  };
});

export const DatePickerComponent = forwardRef(
  (
    {
      value,
      clearable = false,
      size = "sm",
      onChange,
      width,
      height,
      grow,
      className,
      style,
      ...props
    }: DatePickerComponentProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const { classes, cx } = useStyles();
    const { classes: layoutClasses } = useCommonLayoutStyle({
      width,
      height,
      grow,
    });
    const onChangeMantine =
      onChange && ((d: Date | null) => onChange(d ?? undefined));
    return (
      <MantineDatePicker
        ref={ref}
        value={value || null}
        clearButtonLabel="clear"
        className={cx(layoutClasses.style, className)}
        style={style}
        dayClassName={(date, modifiers) =>
          cx({
            [classes.weekend]:
              modifiers.weekend &&
              !modifiers.outside &&
              !modifiers.selected &&
              !modifiers.disabled,
            [classes.selected]: modifiers.selected,
          })
        }
        allowFreeInput
        clearable={clearable}
        size={size}
        inputFormat="MMM DD, YYYY"
        onChange={onChangeMantine}
        {...props}
      />
    );
  },
);
DatePickerComponent.displayName = "DatePickerComponent";

export const DatePicker = forwardRef(
  (props: DatePickerProps, ref: Ref<HTMLInputElement>) => {
    return (
      <ComponentErrorBoundary componentName={DISPLAY_NAME}>
        <DatePickerWithoutRef {...props} innerRef={ref} />
      </ComponentErrorBoundary>
    );
  },
);
const DISPLAY_NAME = "DatePicker";
DatePicker.displayName = DISPLAY_NAME;

export const DatePickerWithoutRef = (
  props: DatePickerProps & { innerRef: Ref<HTMLInputElement> },
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useDatePickerState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
  });
  const { inputProps } = useInput(props, state, dispatch, (v) => v);
  useRegisterFormInput(id, "date-picker");

  const {
    innerRef,
    validate: _,
    onChange: __,
    defaultDisabled: ___,
    defaultValue: ____,
    ...restProps
  } = props;
  return <DatePickerComponent ref={innerRef} {...inputProps} {...restProps} />;
};
