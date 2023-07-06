import { MantineSize, CSSObject } from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { FC, ReactNode } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { TaskQuery } from "components/query";
import { CommonStylingProps } from "components/styling.types";
import { InputProps } from "state/components/input/types";
import { MultiSelectTValue } from "state/components/multiselect/reducer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemComponent = FC<any>;

export type MultiSelectItem = {
  value: string | number;
  label?: string;
  group?: string;
  disabled?: boolean;
};

export type MultiSelectComponentProps = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Initial value of the multiselect.
   */
  defaultValue?: MultiSelectTValue;
  /**
   * Controlled value of the multiselect. Prefer to use defaultValue and component state.
   */
  value?: MultiSelectTValue;
  /**
   * Multiselect label, displayed before the multiselect input. Can be a string or a React component.
   */
  label?: ReactNode;
  /**
   * Text shown when nothing is selected.
   */
  placeholder?: string;
  /**
   * Multiselect description, displayed below the multiselect input. Can be a string or a React component.
   */
  description?: ReactNode;
  /**
   * Nothing found label. Can be a string or a React component.
   */
  nothingFound?: ReactNode;
  /**
   * Callback on multiselect value change. The type is expected by Mantine and is the result of an
   * internal conversion from (value: MultiSelectTValue) => void.
   */
  onChange?: (value: string[]) => void;
  /**
   * Custom function that filters the multiselect options in the dropdown.
   * Defaults to a substring filter.
   */
  filter?: (value: string, selected: boolean, item: MultiSelectItem) => boolean;
  /**
   * Select size.
   */
  size?: MantineSize;
  /**
   * Initial disabled state of the multiselect.
   */
  defaultDisabled?: boolean;
  /**
   * Allows searching when true.
   * @default true
   */
  searchable?: boolean;
  /**
   * Allows clearing the selected items when true.
   * @default false
   */
  clearable?: boolean;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /**
   * The data, or options, to display in the multiselect.
   */
  data: (string | number | MultiSelectItem)[];
  /**
   * The border-radius of the multiselect element.
   */
  radius?: MantineSize;
  /**
   * Displays error message after the multiselect input. Can be a string or a React component.
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
   * Select disabled state. Prefer to use defaultDisabled and component state to disable a multiselect.
   */
  disabled?: boolean;
  /**
   * Whether to automatically focus on the multiselect input.
   */
  autoFocus?: boolean;
  /**
   * If true, the multiselect dropdown is rendered in a React portal.
   * Use this if the multiselect is in a table or dialog and is cut off by its parent container.
   */
  withinPortal?: boolean;
  /**
   * If true, the multiselect component is rendered without any styling applied. The multiselect dropdown is transparent
   * and no padding is applied.
   */
  unstyled?: boolean;
  /**
   * If set, limits the maximum number of selected values.
   */
  maxSelectedValues?: number;
  /**
   * If set, limits the maximum number of search options to show in the dropdown.
   */
  maxDropdownHeight?: number;
  /**
   * CSS style overrides.
   * @deprecated
   */
  sx?: CSSObject;
} & CommonLayoutProps &
  CommonStylingProps;

export type ConnectedMultiSelectProps = {
  /**
   * Callback on multiselect value change.
   */
  onChange?: (value: MultiSelectTValue) => void;
  task?: never;
} & InputProps<MultiSelectTValue, MultiSelectTValue> &
  Omit<MultiSelectComponentProps, "onChange" | "unstyled">;

export type MultiSelectPropsWithTask<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * The task query to execute. The multiselect data will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output.
   */
  outputTransform?: (output: TOutput) => MultiSelectComponentProps["data"];
  /**
   * Callback on multiselect value change.
   */
  onChange?: (value: MultiSelectTValue) => void;
  data?: never;
} & InputProps<MultiSelectTValue, MultiSelectTValue> &
  Omit<MultiSelectComponentProps, "data" | "onChange" | "unstyled">;

export type MultiSelectProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = MultiSelectPropsWithTask<TParams, TOutput> | ConnectedMultiSelectProps;
