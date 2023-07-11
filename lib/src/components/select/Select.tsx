import {
  Select as MantineSelect,
  SelectItem as MantineSelectItem,
} from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { uniq, flatten } from "lodash-es";
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
import { SelectState, useSelectState } from "state/components/select";
import { SelectTValue } from "state/components/select/reducer";
import { useComponentId } from "state/components/useId";
import { useTaskQuery } from "state/tasks/useTaskQuery";

import {
  SelectComponentProps,
  SelectItem,
  ConnectedSelectProps,
  SelectProps,
  SelectPropsWithTask,
} from "./Select.types";

// This prefix gets appended to numbers, so that we can represent them as strings
// internally.
const NUMBER_PREFIX = "__airplane_number__";

const defaultProps: Partial<SelectProps> = {
  searchable: true,
};

export const Select = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: SelectProps<TParams, TOutput>,
) => {
  const [latestRun, setLatestRun] = useState<LatestRun>();
  if (doesUseTask<TParams, TOutput>(props)) {
    return (
      <ComponentErrorBoundary
        componentName={Select.displayName}
        latestRun={latestRun}
      >
        <SelectWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={Select.displayName}>
        <ConnectedSelect {...props} />
      </ComponentErrorBoundary>
    );
  }
};
Select.displayName = "Select";

/**
 * SelectWithTask is a connected select that can directly populate its data from a task.
 */
const SelectWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  task,
  outputTransform,
  setLatestRun,
  ...restProps
}: SelectPropsWithTask<TParams, TOutput> & SetLatestRunProps) => {
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
      componentName: "Select",
    });
  } else {
    return <ConnectedSelect {...restProps} loading={loading} data={data} />;
  }
};

/**
 * ConnectedSelect is a select that's connected to the global component state.
 */
const ConnectedSelect = (props: ConnectedSelectProps) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useSelectState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
  });
  const propsOnChange = props.onChange;
  const { inputProps } = useInput<SelectTValue, SelectState, string | null>(
    {
      ...props,
      onChange:
        propsOnChange &&
        ((v) =>
          propsOnChange(
            v !== null ? convertSelectStringToOriginalType(v) : undefined,
          )),
    },
    state,
    dispatch,
    (v) => (v !== null ? convertSelectStringToOriginalType(v) : undefined),
  );

  useRegisterFormInput(id, "select");

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
      return numberToSelectItem(item);
    } else {
      return selectItemToMantine(item);
    }
  });
  return (
    <SelectComponent
      data={newData}
      {...defaultProps}
      {...inputProps}
      {...restProps}
    />
  );
};

/**
 * Presentational select component.
 */
export const SelectComponent = forwardRef(
  (props: SelectComponentProps, ref: React.Ref<HTMLInputElement>) => (
    <SelectComponentWithoutRef {...props} innerRef={ref} />
  ),
);
SelectComponent.displayName = "SelectComponent";

export const SelectComponentWithoutRef = ({
  loading,
  data,
  value,
  defaultValue,
  filter,
  withinPortal,
  innerRef,
  unstyled,
  disabled,
  ItemComponent,
  itemComponent,
  className,
  style,
  width,
  height,
  grow,
  ...restProps
}: SelectComponentProps & { innerRef: React.Ref<HTMLInputElement> }) => {
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  const newProps = {
    data: data as MantineSelectItem[],
    value: maybeConvertSelectValueToString(value),
    defaultValue: maybeConvertSelectValueToString(defaultValue),
    filter: filter
      ? (value: string, item: MantineSelectItem) => {
          return filter(value, mantineToSelectItem(item));
        }
      : undefined,
  };
  return (
    <MantineSelect
      withinPortal={withinPortal}
      ref={innerRef}
      variant={unstyled ? "unstyled" : undefined}
      className={cx(layoutClasses.style, className)}
      style={style}
      itemComponent={ItemComponent || itemComponent}
      {...newProps}
      {...restProps}
      icon={loading && <Loader size="xs" color="secondary" />}
      disabled={loading || disabled}
    />
  );
};

/**
 * outputToData converts task output to Select data.
 */
function outputToData<TParams extends ParamValues | undefined, TOutput>(
  output: TOutput,
  dataTransform?: SelectPropsWithTask<TParams, TOutput>["outputTransform"],
): SelectComponentProps["data"] {
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
  props: SelectProps<TParams, TOutput>,
): props is SelectPropsWithTask<TParams, TOutput> {
  return Boolean((props as SelectPropsWithTask<TParams, TOutput>).task);
}

/**
 * Unwrap object with one string array entry, e.g. {key: ["a", "b"]}.
 * @returns The unwrapped object or undefined if the object is not unwrappable
 */
const unwrapOutput = (data: unknown): string[] | SelectItem[] | undefined => {
  if (data && !Array.isArray(data) && typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 1) {
      const value = (data as Record<string, unknown>)[keys[0]];
      if (
        Array.isArray(value) &&
        value.every((item: unknown) => typeof item === "object")
      ) {
        // Unwrap if output is an array of objects with a single key (ie SQL task with one column)
        const columns = getColumns(value);
        if (columns.length === 1) {
          return unwrapSingleColumn(value, columns[0]);
        }
        // Unwrap if output is an array of a single object (ie SQL task with one row)
        if (value.length === 1) {
          const rowValues = Object.values(value[0]);
          if (
            rowValues.every((item: unknown) => typeof item === "string") ||
            rowValues.every((item: unknown) => isSelectItem(item))
          ) {
            return rowValues as string[] | SelectItem[];
          }
        }
      }
      if (
        Array.isArray(value) &&
        value.every(
          (item: unknown) => typeof item === "string" || isSelectItem(item),
        )
      ) {
        return value;
      }
    }
  }
  return undefined;
};

const getColumns = (value: Record<string, unknown>[]): string[] => {
  return uniq(flatten(value.map((row) => Object.keys(row))));
};

const unwrapSingleColumn = (
  value: Record<string, unknown>[],
  column_name: string,
): string[] | SelectItem[] | undefined => {
  const unwrapped = value.map((value) => value[column_name]);
  if (
    unwrapped.every((item) => typeof item === "string") ||
    unwrapped.every((item) => isSelectItem(item))
  ) {
    return unwrapped as string[] | SelectItem[];
  }
  return undefined;
};

const isSelectItem = (item: unknown): item is SelectItem =>
  !Array.isArray(item) &&
  typeof item === "object" &&
  typeof (item as Record<string, unknown>).value === "string";

const numberToSelectItem = (value: number) => {
  return { value: convertSelectValueToString(value), label: String(value) };
};

/**
 * Converts a value that the user wants to put in the select to an internal
 * string representation. Non-strings are converted to strings with special
 * strings prepended.
 */
const convertSelectValueToString = (value: string | number): string => {
  if (typeof value === "number") {
    return NUMBER_PREFIX + String(value);
  } else {
    return value;
  }
};
const maybeConvertSelectValueToString = (
  value: string | number | undefined,
): string | null => {
  if (value === undefined) {
    return null;
  }
  return convertSelectValueToString(value);
};

/**
 * Converts our internal representation, which is always a string that can be
 * passed to Mantine, back to the original type.
 */
const convertSelectStringToOriginalType = (s: string): string | number => {
  if (s.startsWith(NUMBER_PREFIX)) {
    return Number(s.substring(NUMBER_PREFIX.length));
  } else {
    return s;
  }
};

/**
 * The following functions convert between our SelectItem type and Mantine's
 * SelectItem type.
 */
const selectItemToMantine = (item: SelectItem): MantineSelectItem => {
  const { value, ...restFields } = item;
  return { value: convertSelectValueToString(value), ...restFields };
};
const mantineToSelectItem = (item: MantineSelectItem): SelectItem => {
  const { value, ...restFields } = item;
  return { value: convertSelectStringToOriginalType(value), ...restFields };
};
