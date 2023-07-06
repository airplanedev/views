import { TextInput as MantineTextInput } from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import { ChangeEvent, forwardRef, Ref, useCallback, useRef } from "react";
import * as React from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useTextInputState } from "state/components/text-input";
import { useComponentId } from "state/components/useId";

import { TextInputComponentProps, TextInputProps } from "./TextInput.types";

export const TextInputComponent = forwardRef(
  (
    { width, ...props }: TextInputComponentProps,
    ref: React.Ref<HTMLInputElement>,
  ) => <MantineTextInput {...props} ref={ref} />,
);

export const TextInput = forwardRef(
  (props: TextInputProps, ref: React.Ref<HTMLInputElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <TextInputWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  ),
);

export const TextInputWithoutRef = (
  props: TextInputProps & { innerRef: React.Ref<HTMLInputElement> },
) => {
  const [inputRef, focus] = useFocus();
  const mergedRef = useMergedRef(inputRef, props.innerRef);
  const id = useComponentId(props.id);
  const { state, dispatch } = useTextInputState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
    focus,
  });
  const { inputProps } = useInput(
    props,
    state,
    dispatch,
    (e: ChangeEvent<HTMLInputElement>) => e.currentTarget.value,
  );
  useRegisterFormInput(id, "text-input");
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
  return (
    <TextInputComponent
      ref={mergedRef}
      className={cx(layoutClasses.style, className)}
      style={style}
      {...inputProps}
      {...restProps}
    />
  );
};

const useFocus = (): [Ref<HTMLInputElement>, () => void] => {
  const htmlElRef = useRef<HTMLInputElement | null>(null);
  const focus = useCallback(() => {
    htmlElRef.current?.focus();
  }, []);

  return [htmlElRef, focus];
};

TextInputComponent.displayName = "TextInputComponent";
const DISPLAY_NAME = "TextInput";
TextInput.displayName = DISPLAY_NAME;
