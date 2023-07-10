import { MantineSize, ModalProps as MantineModalProps } from "@mantine/core";
import React from "react";

import { CommonStylingProps } from "components/styling.types";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type ComponentProps = {
  /** Dialog content. */
  children: React.ReactNode;
  /** Whether the dialog is open. */
  opened: boolean;
  /**
   * Called when the dialog is closed.
   */
  onClose: () => void;
  /**
   * Dialog title, displayed in header before close button.
   */
  title?: React.ReactNode;
  /**
   * Dialog radius.
   * @default lg
   */
  radius?: MantineSize;
  /**
   * Dialog padding.
   * @default lg
   */
  padding?: number | MantineSize;
  /**
   * Dialog body width.
   * @default md
   */
  size?: string | number;
  /**
   * Whether the dialog has a close button on the top right.
   * @default true
   */
  withCloseButton?: boolean;
  /**
   * Whether the dialog should take up the entire screen.
   * @default true
   */
  fullScreen?: boolean;
  /**
   * Whether the dialog should trap focus.
   * @default true
   */
  trapFocus?: boolean;
  classNames?: MantineModalProps["classNames"];
} & CommonStylingProps;

export type Props = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /** Whether the dialog is open initially. */
  defaultOpened?: boolean;
} & Optional<ComponentProps, "opened" | "onClose">;

export type ConfirmationComponentProps = {
  /**
   * Callback when the dialog is confirmed.
   */
  onConfirm: () => void;
  /**
   * Text on the cancel button.
   * An empty string indicates that a cancel button should not be rendered.
   * @default Cancel
   */
  cancelText?: string;
  /**
   * Text on the Confirm button.
   * @default Confirm
   */
  confirmText?: string;
} & Optional<ComponentProps, "children">;

export type ConfirmationProps = Optional<
  ConfirmationComponentProps,
  "opened" | "onClose"
> &
  Pick<Props, "id" | "defaultOpened">;
