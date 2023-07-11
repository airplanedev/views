import { MantineSize, CSSObject } from "@mantine/core";
import type { ParamValues } from "airplane/api";
import { ReactNode } from "react";

import { DefaultOutput, DefaultParams } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { TaskQuery } from "components/query";
import { CommonStylingProps } from "components/styling.types";
import { InputProps } from "state/components/input/types";
import { RadioGroupTValue } from "state/components/radio-group/reducer";

export type RadioGroupComponentProps = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Initial value of the radio group.
   */
  defaultValue?: string;
  /**
   * Controlled value of the radio group. Prefer to use defaultValue and component state.
   */
  value?: RadioGroupTValue;
  /**
   * Radio group label, displayed before the radio group input. Can be a string or a React component.
   */
  label?: ReactNode;
  /**
   * Radio group description, displayed below the radio group input. Can be a string or a React component.
   */
  description?: ReactNode;
  /**
   * Callback on radio group value change.
   */
  onChange?: (value: RadioGroupTValue) => void;
  /**
   * Radio group size.
   */
  size?: MantineSize;
  /**
   * Initial disabled state of the radio group.
   */
  defaultDisabled?: boolean;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /**
   * The data, or options, to display in the radio group.
   */
  data: (string | RadioGroupItem)[];
  /**
   * Displays error message after the radioGroup input. Can be a string or a React component.
   */
  error?: ReactNode;
  /**
   * RadioGroup disabled state. Prefer to use defaultDisabled and component state to disable a radioGroup.
   */
  disabled?: boolean;
  /**
   * Orientation of radio group items.
   * @default horizontal
   */
  orientation?: "horizontal" | "vertical";
  /**
   * CSS style overrides.
   * @deprecated
   */
  sx?: CSSObject;
} & CommonLayoutProps &
  CommonStylingProps;

export type ConnectedRadioGroupProps = InputProps<
  RadioGroupTValue,
  string | undefined
> &
  RadioGroupComponentProps & { task?: never };

export type RadioGroupPropsWithTask<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = InputProps<RadioGroupTValue, string | undefined> & {
  /**
   * The task query to execute. The radioGroup data will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output.
   */
  outputTransform?: (output: TOutput) => RadioGroupComponentProps["data"];
  data?: never;
} & Omit<RadioGroupComponentProps, "data">;

export type RadioGroupProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = RadioGroupPropsWithTask<TParams, TOutput> | ConnectedRadioGroupProps;

export interface RadioGroupItem {
  value: string;
  label?: string;
  disabled?: boolean;
}
