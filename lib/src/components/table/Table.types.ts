import {
  ButtonConfirmOptions,
  ButtonPreset,
  ButtonVariant,
} from "components/button/Button.types";
import { CommonLayoutProps } from "components/layout/layout.types";
import { CommonStylingProps } from "components/styling.types";
import { Color } from "components/theme/colors";
import { NavigateParams } from "routing";

import type { UseCustomCellProps } from "../../@types/react-table-config.types";
import { DefaultOutput, DefaultParams, ParamValues } from "../../client";
import { AirplaneFunc, TaskMutation, TaskQuery } from "../query";

/**
 * Column type for the table.
 *
 * The type makes the `value` type in `Component` and `EditComponent` in `UseCustomCellProps` dependent
 * on the type in TRowData indexed by the `accessor` prop.
 *
 * Example:
 * type User = {
 *   name: string;
 *   age: number;
 * }
 *
 * const columns: Column<User>[] = [
 *   { accessor: "name", Component: ({ value }) => <div>{value}</div> },  // value is string
 *   { accessor: "age", Component: ({ value }) => <div>{value}</div> },  // value is number
 * ];
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Column<TRowData extends object = Record<string, any>> = {
  [K in keyof TRowData]-?: Column_<TRowData, K>;
}[keyof TRowData];

type Column_<TRowData extends object, K extends keyof TRowData> = {
  /**
   * Maps data to this column. e.g. if your accessor is "firstName", the column will display data at row["firstName"].
   * You can also specify deeply nested values with accessors like "name.first" or even "names[0].first".
   *
   * This field uniquely identifies this column and allows you to reference it in the Table `columns` prop.
   *
   * If you are using a task backed table, accessors are automatically inferred from the task output.
   */
  accessor: K;
} & UseCustomCellProps<TRowData[K]>;

export type RowSelectionMode = "single" | "checkbox";
export type ComponentRowAction<TRowData extends object> = (props: {
  row: TRowData;
}) => JSX.Element;

/**
 * Props that are shared among all table components
 */
export type SharedTableProps<TRowData extends object> = {
  /**
   * "single" enables selection of single row while "checkbox" adds a checkbox one each row and enables selection
   * of multiple rows.
   */
  rowSelection?: RowSelectionMode;
  /**
   * If true, a select all checkbox is shown that allows selecting all rows.
   * Only applicable if rowSelection="checkbox".
   * @default true
   */
  selectAll?: boolean;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /**
   * Sets the page size on initial render.
   * @default 10
   */
  defaultPageSize?: number;
  /**
   * Renders an error message.
   */
  error?: string;
  /**
   * The message to display when the table has no data.
   */
  noData?: string;
  /**
   * Sets the title above the table.
   */
  title?: string;
  /**
   * Columns to hide in the table. Reference columns using the column accessor, or the
   * inferred output field for task backed tables.
   */
  hiddenColumns?: string[];
  /**
   * Allows for global filtering when true.
   * @default true
   */
  showFilter?: boolean;
  /**
   * A consistent, unique field used to identify a row. This is used to ensure that
   * row selection is consistent even when the data changes (e.g. when a row is added or deleted).
   *
   * If not provided, defaults to an "id" field on the row, or the index of the row if there is no id.
   * @default id or the index of the row
   */
  rowID?: string;
  /**
   * Function to choose selected rows on initial render.
   */
  isDefaultSelectedRow?: (row: TRowData, rowIndex: number) => boolean;
  /**
   * Function for controlled row selection.
   */
  isSelectedRow?: (row: TRowData, rowIndex: number) => boolean;
  /**
   * Freezes the row actions column when true.
   * @default true
   */
  freezeRowActions?: boolean;
  /**
   * If set, the row actions column will be set to this width, in pixels.
   */
  rowActionsWidth?: number;
  /**
   * Adds a "download as CSV button" to the table footer.
   * If a string is provided, it will be used as the file name with a `.csv` extension appended.
   */
  enableCSVDownload?: boolean | string;
  /**
   * This is called when the selection state of a row is toggled. Passes in the row data
   * as well as the index of the row in the table.
   */
  onToggleRow?: (row: TRowData, idx: number) => void;
  /**
   * This is called when the toggle-all-selected-rows checkbox is pressed when
   * rowSelection is set to "checkbox", with the value of the resulting checkbox.
   *
   * If isSelectedRow is set, and this is not provided, the
   * toggle-all-selected-rows checkbox will not be shown.
   */
  onToggleAllRows?: (value: boolean) => void;
} & CommonLayoutProps &
  CommonStylingProps;

/**
 * Props for the presentational table component
 */
export type TableComponentProps<TRowData extends object> = {
  /**
   * The columns to display in the table.
   */
  columns: Column<TRowData>[];
  /**
   * The data, or rows, to display in the table.
   */
  data: TRowData[];
  /**
   * Adds custom components to the end of each row.
   */
  rowActions?: ComponentRowAction<TRowData>[];
  /**
   * Adds custom components to an overflow menu at the end of each row.
   */
  rowActionsMenu?: ComponentRowAction<TRowData>[];
  /**
   * The computed width of the row actions menu dropdown.
   */
  rowActionsMenuWidth?: number;
  /**
   * Callback on final row selection state. Note that this is an internal prop used for
   * updating component state. To catch changes in row selection from our public-facing
   * API, users should be using onToggleRow.
   */
  onRowSelectionChanged?: (rows: TRowData[]) => void;
} & SharedTableProps<TRowData>;

/*
 * Common props to be supported on row action buttons. We support visual customization
 * that doesn't change a button's size.
 */
export type RowActionButtonProps = {
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
   */
  preset?: ButtonPreset;
  /**
   * Fine grained button appearance. Prefer using preset.
   *
   * filled: Filled with a color
   * outline: White button outlined with a color.
   * light: Filled with a light shade of a color.
   * subtle: Creates a text button with no fill or outline.
   *
   * @default subtle
   */
  variant?: ButtonVariant;
  /**
   * Button disabled state.
   */
  disabled?: boolean;
  /**
   * Button color.
   */
  color?: Color;
};

export type BasicRowAction<TRowData extends object> = (
  | {
      /**
       * Custom label of the row action button.
       */
      label: string;
      /**
       * Callback to run when the button is clicked.
       */
      onClick: (row: TRowData) => void;
      /**
       * Show a confirmation dialog before completing the button action.
       *
       * If the user confirms, the dialog will close and the action will complete.
       *
       * If the user cancels, the dialog will close and the action will not complete.
       *
       * Set to true for a default confirmation dialog or customize the dialog title,
       * body, and buttons.
       */
      confirm?:
        | ButtonConfirmOptions
        | ((row: TRowData) => ButtonConfirmOptions)
        | boolean;
      href?: never;
    }
  | {
      /**
       * Custom label of the row action button.
       */
      label: string;
      /**
       * A function of the row data that returns either a string URL to navigate to
       * when the button is clicked, or a task or view to navigate to in the form of
       * { task: "task_slug", params: ... } or { view: "view_slug", params: ... }.
       */
      href: (row: TRowData) => string | NavigateParams;
      /**
       * Whether the href URL should open in a new tab.
       * @default true
       */
      newTab?: boolean;
      onClick?: never;
    }
) &
  RowActionButtonProps;

export type TaskRowAction<
  TRowData extends object,
  TParams extends ParamValues | undefined = DefaultParams
> = {
  /**
   * Custom label of the row action button.
   * @default task slug
   */
  label?: string;
  /**
   * Transforms the row data before it is passed into the task.
   * Useful when the model of the row does not equal the model of the task parameters.
   */
  getParamsFromRow?: (row: TRowData) => TParams;
  rowTransform?: (row: TRowData) => TParams;
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
  confirm?:
    | ButtonConfirmOptions
    | ((row: TRowData) => ButtonConfirmOptions)
    | boolean;
  onClick?: never;
  href?: never;
} & RowActionButtonProps &
  Exclude<TaskMutation<TParams>, AirplaneFunc>;

/**
 * Base props for task-aware and connected tables
 */
type BaseTableProps<TRowData extends object> = {
  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Adds custom components to the end of each row.
   */
  rowActions?:
    | ComponentRowAction<TRowData>
    | TaskRowAction<TRowData>
    | BasicRowAction<TRowData>
    | (
        | ComponentRowAction<TRowData>
        | TaskRowAction<TRowData>
        | BasicRowAction<TRowData>
      )[];
  /**
   * Adds custom components to an overflow menu at the end of each row.
   */
  rowActionsMenu?:
    | TaskRowAction<TRowData>
    | BasicRowAction<TRowData>
    | (TaskRowAction<TRowData> | BasicRowAction<TRowData>)[];
  /**
   * Sets the table columns. If the table is task-backed, this field overrides the
   * columns inferred from the data.
   */
  columns?: (Column<TRowData> | keyof TRowData)[];
  /**
   * Callback used to modify the table columns.
   *
   * @example
   * columnsTransform={(cols) =>
   *   // Capitalize all the column labels
   *   cols.map((c) => ({ ...c, label: c.label?.toUpperCase() }))
   * }
   */
  columnsTransform?: (
    columns: TableComponentProps<TRowData>["columns"]
  ) => TableComponentProps<TRowData>["columns"];
} & SharedTableProps<TRowData>;

/**
 * Props for the task-aware table component
 */
export type TableWithTaskProps<
  TRowData extends object,
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
> = {
  /**
   * The task query to execute. The table data will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output.
   */
  outputTransform?: (output: TOutput) => TableComponentProps<TRowData>["data"];
  data?: never;
} & BaseTableProps<TRowData>;

/**
 * Props for the table connected to the global component state
 */
export type ConnectedTableProps<TRowData extends object> = {
  /**
   * The data, or rows, to display in the table.
   */
  data: TRowData[];
  task?: never;
} & BaseTableProps<TRowData>;

/**
 * Props for the public magic table component
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type TableProps<
  TRowData extends object = Record<string, any>,
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
> =
  | TableWithTaskProps<TRowData, TParams, TOutput>
  | ConnectedTableProps<TRowData>;
/* eslint-enable @typescript-eslint/no-explicit-any */
