import {
  MantineSize,
  CSSObject,
  SelectProps as MantineSelectProps,
} from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { FC, ReactNode } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { TaskQuery } from "components/query";
import { CommonStylingProps } from "components/styling.types";
import { InputProps } from "state/components/input/types";
import { SelectTValue } from "state/components/select/reducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemComponent = FC<any>;

export type SelectItem = {
  value: string | number;
  label?: string;
  group?: string;
  disabled?: boolean;
};

export type SelectComponentProps = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Initial value of the select.
   */
  defaultValue?: string | number;
  /**
   * Controlled value of the select. Prefer to use defaultValue and component state.
   */
  value?: SelectTValue;
  /**
   * Select label, displayed before the select input. Can be a string or a React component.
   */
  label?: ReactNode;
  /**
   * Text shown when nothing is selected.
   */
  placeholder?: string;
  /**
   * Select description, displayed below the select input. Can be a string or a React component.
   */
  description?: ReactNode;
  /**
   * Nothing found label. Can be a string or a React component.
   */
  nothingFound?: ReactNode;
  /**
   * Callback on select value change. The type is expected by Mantine and is the result of an
   * internal conversion from (value: SelectTValue) => void.
   */
  onChange?: (value: string | null) => void;
  /**
   * Custom function that filters the select options in the dropdown.
   * Defaults to a substring filter.
   */
  filter?: (value: string, item: SelectItem) => boolean;
  /**
   * Select size.
   */
  size?: MantineSize;
  /**
   * Initial disabled state of the select.
   */
  defaultDisabled?: boolean;
  /**
   * Allows searching when true.
   * @default true
   */
  searchable?: boolean;
  /**
   * Allows clearing the selected item when true.
   * @default false
   */
  clearable?: boolean;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /**
   * The data, or options, to display in the select.
   */
  data: (string | number | SelectItem)[];
  /**
   * The border-radius of the select element.
   */
  radius?: MantineSize;
  /**
   * Allow deselecting items on click.
   * @default false
   */
  allowDeselect?: boolean;
  /**
   * Displays error message after the select input. Can be a string or a React component.
   */
  error?: ReactNode;
  /**
   * Initial dropdown opened state.
   * @default false
   */
  initiallyOpened?: boolean;
  /**
   * The component with which the item is rendered.
   */
  ItemComponent?: ItemComponent;
  /**
   * The component with which the item is rendered.
   * @deprecated - Use ItemComponent instead.
   */
  itemComponent?: ItemComponent;
  /**
   * Select disabled state. Prefer to use defaultDisabled and component state to disable a select.
   */
  disabled?: boolean;
  /**
   * Whether to automatically focus on the select input.
   */
  autoFocus?: boolean;
  /**
   * If true, the select dropdown is rendered in a React portal.
   * Use this if the select is in a table or dialog and is cut off by its parent container.
   */
  withinPortal?: boolean;
  /**
   * If true, the select component is rendered without any styling applied. The select dropdown is transparant
   * and no padding is applied.
   * */
  unstyled?: boolean;
  /**
   * If true, the select component is read only.
   */
  readOnly?: boolean;
  /**
   * CSS style overrides.
   * @deprecated
   */
  sx?: CSSObject;
  classNames?: MantineSelectProps["classNames"];
} & CommonLayoutProps &
  CommonStylingProps;

export type ConnectedSelectProps = {
  /**
   * Callback on select value change.
   */
  onChange?: (value: SelectTValue) => void;
  task?: never;
} & InputProps<SelectTValue, SelectTValue> &
  Omit<SelectComponentProps, "onChange">;

export type SelectPropsWithTask<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * The task query to execute. The select data will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output.
   */
  outputTransform?: (output: TOutput) => SelectComponentProps["data"];
  /**
   * Callback on select value change.
   */
  onChange?: (value: SelectTValue) => void;
  data?: never;
} & InputProps<SelectTValue, SelectTValue> &
  Omit<SelectComponentProps, "data" | "onChange">;

export type SelectProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = SelectPropsWithTask<TParams, TOutput> | ConnectedSelectProps;
