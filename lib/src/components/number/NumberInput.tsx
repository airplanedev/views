import { NumberInput as MantineNumberInput } from "@mantine/core";
import { forwardRef } from "react";
import * as React from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useNumberInputState } from "state/components/number-input";
import { useComponentId } from "state/components/useId";

import {
  NumberInputComponentProps,
  NumberInputProps,
} from "./NumberInput.types";
import {
  currencyFormatter,
  currencyParser,
  percentFormatter,
  percentParser,
} from "./numberUtils";

export const NumberInputComponent = forwardRef(
  (
    { width, ...props }: NumberInputComponentProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    let parser;
    let formatter;
    if (props.format === "currency") {
      parser = currencyParser(props.currency);
      formatter = currencyFormatter(props.currency);
    } else if (props.format === "percent") {
      parser = percentParser;
      formatter = percentFormatter;
    }
    return (
      <MantineNumberInput
        parser={parser}
        formatter={formatter}
        {...props}
        ref={ref}
      />
    );
  },
);

export const NumberInput = forwardRef(
  (props: NumberInputProps, ref: React.Ref<HTMLInputElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <NumberInputWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  ),
);

export const NumberInputWithoutRef = (
  props: NumberInputProps & { innerRef: React.Ref<HTMLInputElement> },
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useNumberInputState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
    focus,
    min: props.min,
    max: props.max,
  });
  const { inputProps } = useInput(props, state, dispatch, (v) => v);
  const {
    className,
    style,
    width,
    height,
    grow,
    innerRef: _,
    validate: __,
    onChange: ___,
    defaultDisabled: ____,
    defaultValue: _____,
    ...restProps
  } = props;
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  useRegisterFormInput(id, "number-input");
  return (
    <NumberInputComponent
      ref={props.innerRef}
      className={cx(layoutClasses.style, className)}
      style={style}
      {...inputProps}
      {...restProps}
    />
  );
};
NumberInputComponent.displayName = "NumberInputComponent";
const DISPLAY_NAME = "NumberInput";
NumberInput.displayName = DISPLAY_NAME;
