import { Textarea as MantineTextarea } from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import { ChangeEvent, forwardRef, Ref, useCallback, useRef } from "react";
import * as React from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useTextareaState } from "state/components/text-input";
import { useComponentId } from "state/components/useId";

import { TextareaComponentProps, TextareaProps } from "./Textarea.types";

export const TextareaComponent = forwardRef(
  (props: TextareaComponentProps, ref: React.Ref<HTMLTextAreaElement>) => (
    <MantineTextarea {...props} ref={ref} />
  )
);

export const Textarea = forwardRef(
  (props: TextareaProps, ref: React.Ref<HTMLTextAreaElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <TextareaWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  )
);

export const TextareaWithoutRef = (
  props: TextareaProps & { innerRef: React.Ref<HTMLTextAreaElement> }
) => {
  const [inputRef, focus] = useFocus();
  const mergedRef = useMergedRef(inputRef, props.innerRef);
  const id = useComponentId(props.id);
  const { state, dispatch } = useTextareaState(id, {
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
    (e: ChangeEvent<HTMLTextAreaElement>) => e.currentTarget.value
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
    <TextareaComponent
      ref={mergedRef}
      className={cx(layoutClasses.style, className)}
      style={style}
      {...inputProps}
      {...restProps}
    />
  );
};

const useFocus = (): [Ref<HTMLTextAreaElement>, () => void] => {
  const htmlElRef = useRef<HTMLTextAreaElement | null>(null);
  const focus = useCallback(() => {
    htmlElRef.current?.focus();
  }, []);

  return [htmlElRef, focus];
};

TextareaComponent.displayName = "TextareaComponent";
const DISPLAY_NAME = "Textarea";
Textarea.displayName = DISPLAY_NAME;
