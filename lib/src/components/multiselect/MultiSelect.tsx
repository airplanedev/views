import {
  MultiSelect as MantineMultiSelect,
  SelectItem as MantineMultiSelectItem,
} from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { forwardRef, useState } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import {
  LatestRun,
  SetLatestRunProps,
  useSetLatestRunInTaskQuery,
} from "components/errorBoundary/LatestRunDetails";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { Loader } from "components/loader/Loader";
import { displayTaskBackedError } from "errors/displayTaskBackedError";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import {
  MultiSelectState,
  useMultiSelectState,
} from "state/components/multiselect";
import { MultiSelectTValue } from "state/components/multiselect/reducer";
import { useComponentId } from "state/components/useId";
import { useTaskQuery } from "state/tasks/useTaskQuery";

import {
  MultiSelectComponentProps,
  MultiSelectItem,
  ConnectedMultiSelectProps,
  MultiSelectProps,
  MultiSelectPropsWithTask,
} from "./MultiSelect.types";

// This prefix gets appended to numbers, so that we can represent them as strings
// internally.
const NUMBER_PREFIX = "__airplane_number__";

const defaultProps: Partial<MultiSelectProps> = {
  searchable: true,
};

export const MultiSelect = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: MultiSelectProps<TParams, TOutput>,
) => {
  const [latestRun, setLatestRun] = useState<LatestRun>();

  if (doesUseTask<TParams, TOutput>(props)) {
    return (
      <ComponentErrorBoundary
        componentName={MultiSelect.displayName}
        latestRun={latestRun}
      >
        <MultiSelectWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={MultiSelect.displayName}>
        <ConnectedMultiSelect {...props} />{" "}
      </ComponentErrorBoundary>
    );
  }
};

MultiSelect.displayName = "MultiSelect";

/**
 * MultiSelectWithTask is a connected multiselect that can directly populate its data from a task.
 */
const MultiSelectWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  task,
  outputTransform,
  setLatestRun,
  ...restProps
}: MultiSelectPropsWithTask<TParams, TOutput> & SetLatestRunProps) => {
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
      componentName: "MultiSelect",
    });
  } else {
    return (
      <ConnectedMultiSelect {...restProps} loading={loading} data={data} />
    );
  }
};

/**
 * ConnectedMultiSelect is a multiselect that's connected to the global component state.
 */
const ConnectedMultiSelect = (props: ConnectedMultiSelectProps) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useMultiSelectState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
  });
  const propsOnChange = props.onChange;
  const { inputProps } = useInput<
    MultiSelectTValue,
    MultiSelectState,
    string[]
  >(
    {
      ...props,
      onChange:
        propsOnChange &&
        ((v) =>
          propsOnChange(
            v.map((vs) => convertMultiSelectStringToOriginalType(vs)),
          )),
    },
    state,
    dispatch,
    (v) => v.map((vs) => convertMultiSelectStringToOriginalType(vs)),
  );

  useRegisterFormInput(id, "multi-select");

  const {
    data,
    validate: _,
    onChange: __,
    defaultDisabled: ___,
    defaultValue: ____,
    ...restProps
  } = props;

  const newData = data.map((item) => {
    if (typeof item === "string") {
      return item;
    } else if (typeof item === "number") {
      return numberToMultiSelectItem(item);
    } else {
      return multiSelectItemToMantine(item);
    }
  });
  return (
    <MultiSelectComponent
      data={newData}
      {...defaultProps}
      {...inputProps}
      {...restProps}
    />
  );
};

/**
 * Presentational multiselect component.
 */
export const MultiSelectComponent = forwardRef(
  (props: MultiSelectComponentProps, ref: React.Ref<HTMLInputElement>) => (
    <MultiSelectComponentWithoutRef {...props} innerRef={ref} />
  ),
);
MultiSelectComponent.displayName = "MultiSelectComponent";

export const MultiSelectComponentWithoutRef = ({
  loading,
  data,
  value,
  defaultValue,
  filter,
  withinPortal,
  innerRef,
  unstyled,
  ItemComponent,
  itemComponent,
  disabled,
  className,
  style,
  width,
  height,
  grow,
  ...restProps
}: MultiSelectComponentProps & { innerRef: React.Ref<HTMLInputElement> }) => {
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  const newProps = {
    data: data as MantineMultiSelectItem[],
    value: value?.map((vs) => convertMultiSelectValueToString(vs)),
    defaultValue: defaultValue?.map((vs) =>
      convertMultiSelectValueToString(vs),
    ),
    filter: filter
      ? (value: string, selected: boolean, item: MantineMultiSelectItem) => {
          return filter(value, selected, mantineToMultiSelectItem(item));
        }
      : undefined,
  };
  return (
    <MantineMultiSelect
      withinPortal={withinPortal}
      ref={innerRef}
      variant={unstyled ? "unstyled" : undefined}
      className={cx(layoutClasses.style, className)}
      style={style}
      itemComponent={ItemComponent || itemComponent}
      {...newProps}
      {...restProps}
      icon={loading && <Loader size="xs" color="secondary" />}
      disabled={disabled || loading}
    />
  );
};

/**
 * outputToData converts task output to MultiSelect data.
 */
function outputToData<TParams extends ParamValues | undefined, TOutput>(
  output: TOutput,
  dataTransform?: MultiSelectPropsWithTask<TParams, TOutput>["outputTransform"],
): MultiSelectComponentProps["data"] {
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
  props: MultiSelectProps<TParams, TOutput>,
): props is MultiSelectPropsWithTask<TParams, TOutput> {
  return Boolean((props as MultiSelectPropsWithTask<TParams, TOutput>).task);
}

/**
 * Unwrap object with one string array entry, e.g. {key: ["a", "b"]}.
 * @returns The unwrapped object or undefined if the object is not unwrappable
 */
const unwrapOutput = (
  data: unknown,
): string[] | MultiSelectItem[] | undefined => {
  if (data && !Array.isArray(data) && typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      const value = (data as Record<string, unknown>)[keys[0]];
      if (
        Array.isArray(value) &&
        value.every(
          (item: unknown) =>
            typeof item === "string" || isMultiSelectItem(item),
        )
      ) {
        return value;
      }
    }
  }
  return undefined;
};

const isMultiSelectItem = (item: unknown): item is MultiSelectItem =>
  !Array.isArray(item) &&
  typeof item === "object" &&
  typeof (item as Record<string, unknown>).value === "string";

const numberToMultiSelectItem = (value: number) => {
  return {
    value: convertMultiSelectValueToString(value),
    label: String(value),
  };
};

/**
 * Converts a value that the user wants to put in the multiselect to an internal
 * string representation. Non-strings are converted to strings with special
 * strings prepended.
 */
const convertMultiSelectValueToString = (value: string | number): string => {
  if (typeof value === "number") {
    return NUMBER_PREFIX + String(value);
  } else {
    return value;
  }
};

/**
 * Converts our internal representation, which is always a string that can be
 * passed to Mantine, back to the original type.
 */
const convertMultiSelectStringToOriginalType = (s: string): string | number => {
  if (s.startsWith(NUMBER_PREFIX)) {
    return Number(s.substring(NUMBER_PREFIX.length));
  } else {
    return s;
  }
};

/**
 * The following functions convert between our MultiSelectItem type and Mantine's
 * MultiSelectItem type.
 */
const multiSelectItemToMantine = (
  item: MultiSelectItem,
): MantineMultiSelectItem => {
  const { value, ...restFields } = item;
  return { value: convertMultiSelectValueToString(value), ...restFields };
};
const mantineToMultiSelectItem = (
  item: MantineMultiSelectItem,
): MultiSelectItem => {
  const { value, ...restFields } = item;
  return {
    value: convertMultiSelectStringToOriginalType(value),
    ...restFields,
  };
};
