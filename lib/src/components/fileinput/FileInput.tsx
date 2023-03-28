import { AirplaneFile } from "airplane";
import { forwardRef, Ref } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { FileInputState, useFileInputState } from "state/components/file-input";
import { FileInputTValue } from "state/components/file-input/reducer";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useComponentId } from "state/components/useId";

import { BasicFileInputComponent } from "./BasicFileInput";
import { DropzoneFileInputComponent } from "./DropzoneFileInput";
import { FileInputProps } from "./FileInput.types";

const EMPTY_ARRAY: AirplaneFile[] = [];

export const FileInput = forwardRef(
  (
    { variant = "dropzone", ...restProps }: FileInputProps,
    ref: Ref<HTMLDivElement> | Ref<HTMLButtonElement>
  ) => {
    return (
      <ComponentErrorBoundary componentName={DISPLAY_NAME}>
        <FileInputWithoutRef
          variant={variant}
          {...restProps}
          innerRef={ref as Ref<HTMLDivElement>}
        />
      </ComponentErrorBoundary>
    );
  }
);

export const FileInputWithoutRef = ({
  variant,
  ...props
}: FileInputProps & {
  innerRef: Ref<HTMLDivElement> | Ref<HTMLButtonElement>;
}) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useFileInputState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      initialValue: props.multiple ? EMPTY_ARRAY : undefined,
    },
  });
  // newOnChange is passed to FileInputComponent, which operates on AirplaneFile[].
  // It delegates to the user-provided onChange, and extracts the single element from
  // the input array if in single selection mode.
  const newOnChange: (v: AirplaneFile[]) => void = props.multiple
    ? (v) => props.onChange?.(v)
    : (v) => props.onChange?.(v.length ? v[0] : undefined);
  const { inputProps } = useInput<
    FileInputTValue,
    FileInputState,
    AirplaneFile[]
  >(
    {
      ...props,
      onChange: newOnChange,
    },
    state,
    dispatch,
    (v: AirplaneFile[]) => (props.multiple ? v : v.length ? v[0] : undefined)
  );
  useRegisterFormInput(id, "file-input");
  const {
    innerRef,
    className,
    style,
    width,
    height,
    grow,
    validate: _,
    onChange: __,
    defaultDisabled: ___,
    ...restProps
  } = props;
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  if (variant === "dropzone") {
    return (
      <DropzoneFileInputComponent
        ref={innerRef as Ref<HTMLDivElement>}
        className={cx(layoutClasses.style, className)}
        style={style}
        {...inputProps}
        {...restProps}
      />
    );
  } else {
    return (
      <BasicFileInputComponent
        ref={innerRef as Ref<HTMLButtonElement>}
        className={cx(layoutClasses.style, className)}
        style={style}
        {...inputProps}
        {...restProps}
      />
    );
  }
};
const DISPLAY_NAME = "FileInput";
FileInput.displayName = DISPLAY_NAME;
