import { MantineSize, CSSObject } from "@mantine/core";
import { AirplaneFile } from "airplane";

import { CommonLayoutProps } from "components/layout/layout.types";
import { CommonStylingProps } from "components/styling.types";
import { FileInputTValue } from "state/components/file-input/reducer";
import { InputProps } from "state/components/input/types";

export type FileInputComponentProps = {
  /**
   * An array of MIME types to accept. For example, ["image/png", "image/jpeg"].
   */
  accept?: string[];
  /**
   * If true, disables drag and drop. This prop is ignored if variant is "basic".
   * @default false
   */
  disableDragAndDrop?: boolean;
  /**
   * Whether the user can clear the input.
   * @default false
   */
  clearable?: boolean;
  /**
   * Determines whether multiple files can be selected.
   * @default false
   */
  multiple?: boolean;
  /**
   * The maximum number of files that can be selected. This prop is ignored if variant is
   * "basic".
   */
  maxFiles?: number;
  /**
   * The maximum allowable file size in bytes. This prop is ignored if variant is "basic".
   */
  maxSize?: number;
  /**
   * Label displayed above the input.
   */
  label?: React.ReactNode;
  /**
   * Hint text displayed when the input is empty.
   */
  placeholder?: string;
  /**
   * Description displayed below the input.
   */
  description?: React.ReactNode;
  /**
   * Error displayed below the input.
   */
  error?: React.ReactNode;
  /**
   * Selected file(s) if using this component as a controlled component. Prefer to use the
   * component state to get the value.
   */
  value?: FileInputTValue;
  /**
   * Callback function for when the file(s) in the file input changes.
   */
  onChange: (v: AirplaneFile[]) => void;
  /**
   * Disables the input. Prefer to use defaultDisabled and component state.
   */
  disabled?: boolean;
  /**
   * The input's border radius.
   */
  radius?: MantineSize;
  /**
   * If set, this function will be used to get the upload url for selected files. For
   * convenience, the id field of AirplaneFiles created by this component is set to the
   * upload ID returned by the promise.
   */
  getUploadURL?: (
    filename: string,
    sizeBytes: number,
  ) => Promise<{ uploadID: string; readURL: string; writeURL: string }>;
  /**
   * CSS style overrides.
   * @deprecated
   */
  sx?: CSSObject;
} & CommonLayoutProps &
  CommonStylingProps;

export type FileInputSingleProps = Omit<
  FileInputComponentProps,
  "value" | "multiple" | "onChange"
> & {
  /**
   * Selected file if using this component as a controlled component. Prefer to use the
   * component state to get the value.
   */
  value?: AirplaneFile | undefined;
  /**
   * Determines whether multiple files can be selected.
   */
  multiple?: false;
  /**
   * Callback function for when the file in the file input changes.
   */
  onChange?: (v: AirplaneFile | undefined) => void;
};

export type FileInputMultipleProps = Omit<
  FileInputComponentProps,
  "value" | "multiple" | "onChange"
> & {
  /**
   * Selected files if using this component as a controlled component. Prefer to use the
   * component state to get the value.
   */
  value?: AirplaneFile[];
  /**
   * Determines whether multiple files can be selected.
   */
  multiple: true;
  /**
   * Callback function for when the files in the file input change.
   */
  onChange?: (v: AirplaneFile[]) => void;
};

export type FileInputProps = (FileInputSingleProps | FileInputMultipleProps) & {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * The input's disabled state on initial render.
   */
  defaultDisabled?: boolean;
  /**
   * The file input variant, either dropzone or basic.
   * @default dropzone
   */
  variant?: "dropzone" | "basic";
} & Omit<InputProps<FileInputTValue, AirplaneFile[]>, "onChange">;
