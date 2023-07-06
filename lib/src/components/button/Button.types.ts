import { CSSObject } from "@mantine/core";
import { MantineSize } from "@mantine/styles";
import { MouseEventHandler } from "react";
import React from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import { CommonLayoutProps } from "components/layout/layout.types";
import { RunbookMutation, TaskMutation } from "components/query";
import { CommonStylingProps } from "components/styling.types";
import type { Color } from "components/theme/colors";
import { NavigateParams } from "routing";

export type ButtonComponentLinkPropsBase = {
  /**
   * This can be either:
   *
   * A string URL to navigate to when the button is clicked.
   *
   * A task or view to navigate to in the form of { task: "task_slug" } or { view: "view_slug" }. You can also provide optional params.
   */
  href: string | NavigateParams;
  /**
   * Whether the href URL should open in a new tab.
   * @default true
   */
  newTab?: boolean;
  onClick?: never;
} & ButtonComponentBaseProps;

/** Props for a button that is an anchor element */
export type ButtonComponentLinkProps = ButtonComponentLinkPropsBase &
  Omit<
    JSX.IntrinsicElements["a"],
    keyof ButtonComponentLinkPropsBase | "ref" | "onClick"
  >;

export type ButtonComponentButtonPropsBase = {
  /**
   * Callback on click
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /**
   * Show a confirmation dialog before completing the button action.
   *
   * If the user confirms, the dialog will close and the action will complete.
   *
   * If the user cancels, the dialog will close and the action will not complete.
   *
   * Set to true for a default confirmation dialog or customize the dialog title, body,
   * and buttons.
   */
  confirm?: ButtonConfirmOptions | boolean;
  href?: never;
} & ButtonComponentBaseProps;

export type ButtonConfirmOptions = {
  /** Title of the confirmation dialog. */
  title?: React.ReactNode | string;
  /** Text of the cancellation button on the confirmation dialog. */
  cancelText?: string;
  /** Text of the confirmation button on the confirmation dialog. */
  confirmText?: string;
  /** Body of the confirmation dialog. */
  body?: React.ReactNode | string;
  /**
   * Callback when the confirmation is activated.
   * It is generally not necessary to set this callback.
   * Use the onClick callback when you want access to the click event (e.g. to stopPropagation)
   * or to do something before the confirmation dialog is shown.
   * @example
   * onClick={(e) => e.stopPropagation()}
   */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

/** Props for a button that is a button element */
export type ButtonComponentButtonProps = ButtonComponentButtonPropsBase &
  Omit<
    JSX.IntrinsicElements["button"],
    keyof ButtonComponentButtonPropsBase | "href" | "ref"
  >;

export type ButtonVariant = "filled" | "outline" | "light" | "subtle";

export type ButtonPreset = "primary" | "secondary" | "tertiary" | "danger";

/** Base props that all buttons share */
export type ButtonComponentBaseProps = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Built in button appearances that apply a set variant and color. The variant and/or
   * color can be overriden by specifying a custom variant or color.
   *
   * primary: The primary page action. Usually there should only be one of these that
   *   represents the single most important thing a user can do.
   * secondary: Secondary actions on a page. These are important, but not as important
   *   as the primary.
   * tertiary: Supplmental actions that can be done on a page.
   * danger: Actions that delete or do otherwise dangerous actions.
   *
   * @default primary
   */
  preset?: ButtonPreset;
  /**
   * Fine-grained button appearance. Prefer using preset.
   *
   * filled: Filled with a color
   * outline: White button outlined with a color.
   * light: Filled with a light shade of a color.
   * subtle: Creates a text button with no fill or outline.
   */
  variant?: ButtonVariant;
  /**
   * Button size.
   */
  size?: MantineSize;
  /**
   * Button disabled state.
   */
  disabled?: boolean;
  /**
   * Button color.
   */
  color?: Color;
  /**
   * Button label.
   */
  children?: React.ReactNode;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /** Button border-radius. */
  radius?: MantineSize;
  /** Render a slimmer button with less padding. */
  compact?: boolean;
  /** Button type attribute. */
  type?: "submit" | "button" | "reset";
  /** Icon to include on the left side of the button. */
  leftIcon?: React.ReactNode;
  /** Icon to include on the right side of the button. */
  rightIcon?: React.ReactNode;
  /**
   * If true, the button will take up the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * Whether to left align the button label.
   * @default false
   */
  leftAlign?: boolean;
  disableFocusRing?: boolean;
  stopPropagation?: boolean;
  /**
   * CSS style overrides.
   * @deprecated
   */
  sx?: CSSObject;
} & CommonLayoutProps &
  CommonStylingProps;

export type ButtonComponentProps =
  | ButtonComponentLinkProps
  | ButtonComponentButtonProps;

export type ButtonPropsWithTask<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * The task query to execute on button click.
   */
  task: TaskMutation<TParams, TOutput>;
  runbook?: never;
} & ButtonComponentButtonProps;

export type ButtonPropsWithRunbook<
  TParams extends ParamValues | undefined = DefaultParams,
> = {
  /**
   * The runbook mutation to execute on button click.
   */
  runbook: RunbookMutation<TParams>;
  task?: never;
} & ButtonComponentButtonProps;

export type ButtonProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | (ButtonComponentProps & { task?: never; runbook?: never })
  | ButtonPropsWithTask<TParams, TOutput>
  | ButtonPropsWithRunbook<TParams>;
