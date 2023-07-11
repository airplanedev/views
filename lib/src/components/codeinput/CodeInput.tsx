import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import React from "react";
import { useCallback, useRef } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useCodeInputState } from "state/components/text-input";
import { useComponentId } from "state/components/useId";

import { CodeInputProps } from "./CodeInput.types";
const CodeInputComponent = React.lazy(() => import("./CodeInputComponent"));

export const CodeInput = ({
  id,
  defaultValue,
  defaultDisabled,
  validate,
  required,
  onChange,
  ...restProps
}: CodeInputProps) => {
  id = useComponentId(id);
  const ref = useRef<ReactCodeMirrorRef>({});
  const focus = useCallback(() => {
    ref.current?.view?.focus();
  }, []);
  const { state, dispatch } = useCodeInputState(id, {
    initialState: {
      disabled: restProps.disabled ?? defaultDisabled,
      value: restProps.value ?? defaultValue,
    },
    focus,
  });
  const { inputProps } = useInput(
    { validate, required, onChange },
    state,
    dispatch,
    (v) => v,
  );

  useRegisterFormInput(id, "text-input");

  return (
    <ComponentErrorBoundary componentName={CodeInput.displayName}>
      <React.Suspense fallback={null}>
        <CodeInputComponent
          innerRef={ref}
          required={required}
          {...inputProps}
          {...restProps}
        />
      </React.Suspense>
    </ComponentErrorBoundary>
  );
};

CodeInput.displayName = "CodeInput";
