import { Radio as MantineRadio, createStyles } from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { useState } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import {
  LatestRun,
  SetLatestRunProps,
  useSetLatestRunInTaskQuery,
} from "components/errorBoundary/LatestRunDetails";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { Text } from "components/text/Text";
import { displayTaskBackedError } from "errors/displayTaskBackedError";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useRadioGroupState } from "state/components/radio-group";
import { RadioGroupTValue } from "state/components/radio-group/reducer";
import { useComponentId } from "state/components/useId";
import { useTaskQuery } from "state/tasks/useTaskQuery";

import {
  RadioGroupComponentProps,
  ConnectedRadioGroupProps,
  RadioGroupProps,
  RadioGroupPropsWithTask,
  RadioGroupItem,
} from "./RadioGroup.types";

export const useStyles = createStyles((theme) => {
  const focusRingRGB = theme.fn.variant({
    variant: "filled",
    color: "primary",
  }).background;
  return {
    radio: {
      "&:focus": {
        ...theme.fn.focusStyles()["&:focus"],
        outline: `2px solid ${focusRingRGB}`,
      },
      "&:focus:not(:focus-visible)": {
        ...theme.fn.focusStyles()["&:focus"],
        outline: `2px solid ${focusRingRGB}`,
      },
    },
    label: { color: theme.colors.gray[7] },
  };
});

export const RadioGroup = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: RadioGroupProps<TParams, TOutput>,
) => {
  const [latestRun, setLatestRun] = useState<LatestRun>();

  if (doesUseTask<TParams, TOutput>(props)) {
    return (
      <ComponentErrorBoundary
        componentName={RadioGroup.displayName}
        latestRun={latestRun}
      >
        <RadioGroupWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={RadioGroup.displayName}>
        <ConnectedRadioGroup {...props} />{" "}
      </ComponentErrorBoundary>
    );
  }
};
RadioGroup.displayName = "RadioGroup";

/**
 * RadioGroupWithTask is a connected radio group that can directly populate its data from a task.
 */
const RadioGroupWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  task,
  outputTransform,
  setLatestRun,
  ...restProps
}: RadioGroupPropsWithTask<TParams, TOutput> & SetLatestRunProps) => {
  const fullQuery = useSetLatestRunInTaskQuery<TParams>(task, setLatestRun);
  const { error, loading, output, runID } = useTaskQuery<TParams, TOutput>(
    fullQuery,
  );

  const data = output
    ? outputToData<TParams, TOutput>(output, outputTransform)
    : [];

  if (error) {
    return displayTaskBackedError({
      error,
      taskSlug: fullQuery.slug,
      runID,
      componentName: "RadioGroup",
    });
  } else {
    return <ConnectedRadioGroup {...restProps} loading={loading} data={data} />;
  }
};

/**
 * ConnectedRadioGroup is a radio group that's connected to the global component state.
 */
const ConnectedRadioGroup = (props: ConnectedRadioGroupProps) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useRadioGroupState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
  });
  const { inputProps } = useInput(
    props,
    state,
    dispatch,
    (v: RadioGroupTValue) => v,
  );

  useRegisterFormInput(id, "radio-group");

  const {
    validate: _,
    onChange: __,
    defaultDisabled: ___,
    defaultValue: ____,
    ...restProps
  } = props;
  return <RadioGroupComponent {...inputProps} {...restProps} />;
};

/**
 * Presentational radio group component.
 *
 * Passes through to the Mantine Radio.Group component.
 */
const RadioGroupComponent = ({
  loading,
  data,
  disabled,
  className,
  style,
  width,
  height,
  grow,
  ...restProps
}: RadioGroupComponentProps) => {
  const { classes } = useStyles();
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  if (loading) {
    return <Text disableMarkdown>Loading...</Text>;
  }
  const radioGroupData = data.map((datum) => {
    if (typeof datum === "string") {
      return { value: datum };
    }
    return datum;
  });
  return (
    <MantineRadio.Group
      className={cx(layoutClasses.style, className)}
      style={style}
      {...restProps}
    >
      {radioGroupData.map((item, idx) => {
        return (
          <MantineRadio
            classNames={classes}
            key={idx}
            value={item.value}
            label={item.label ?? item.value}
            disabled={disabled || item.disabled}
          />
        );
      })}
    </MantineRadio.Group>
  );
};

/**
 * outputToData converts task output to Radio data.
 */
function outputToData<TParams extends ParamValues | undefined, TOutput>(
  output: TOutput,
  dataTransform?: RadioGroupPropsWithTask<TParams, TOutput>["outputTransform"],
): RadioGroupComponentProps["data"] {
  if (!output) {
    return [];
  }
  if (dataTransform) {
    return dataTransform(output);
  }
  if (Array.isArray(output)) {
    return output;
  }
  const unwrappedOutput = unwrapOutput(output);
  if (unwrappedOutput) {
    return unwrappedOutput;
  }
  return [];
}

function doesUseTask<TParams extends ParamValues | undefined, TOutput>(
  props: RadioGroupProps<TParams, TOutput>,
): props is RadioGroupPropsWithTask<TParams, TOutput> {
  return Boolean((props as RadioGroupPropsWithTask<TParams, TOutput>).task);
}

/**
 * Unwrap object with one string array entry, e.g. {key: ["a", "b"]}.
 * @returns The unwrapped object or null if the object is not unwrappable
 */
const unwrapOutput = (data: unknown): string[] | RadioGroupItem[] | null => {
  if (data && !Array.isArray(data) && typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      const value = (data as Record<string, unknown>)[keys[0]];
      if (
        Array.isArray(value) &&
        value.every(
          (item: unknown) => typeof item === "string" || isRadio(item),
        )
      ) {
        return value;
      }
    }
  }
  return null;
};

const isRadio = (item: unknown): item is RadioGroupItem =>
  !Array.isArray(item) &&
  typeof item === "object" &&
  typeof (item as Record<string, unknown>).value === "string";
