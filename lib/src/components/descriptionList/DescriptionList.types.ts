import type { ParamValues } from "airplane/api";
import React from "react";

import { DefaultOutput, DefaultParams } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { TaskQuery } from "components/query";
import { CommonStylingProps } from "components/styling.types";

export type DescriptionListComponentProps = {
  /** List of terms and descriptions. */
  items: {
    /** Appears on the left side of the description list. This serves as the key. */
    term: React.ReactNode;
    /** Appears on the right side of the description list. This serves as the value. */
    description: React.ReactNode;
  }[];
  /**
   * Alignment of the term and description.
   * @default start
   */
  align?: "start" | "center" | "end";
  /**
   * Renders a loading state when true.
   */
  loading?: boolean;
} & CommonLayoutProps &
  CommonStylingProps;

export type DescriptionListPropsWithTask<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * The task query to execute. The description list items will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output before it populates the description list items.
   */
  outputTransform?: (
    output: TOutput,
  ) => DescriptionListComponentProps["items"] | Record<string, React.ReactNode>;
  items?: never;
} & Omit<DescriptionListComponentProps, "items">;

export type DescriptionListProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | DescriptionListPropsWithTask<TParams, TOutput>
  | DescriptionListComponentProps;
