import { Datum } from "plotly.js-basic-dist";

import { CommonLayoutProps } from "components/layout/layout.types";
import { CommonStylingProps } from "components/styling.types";

import { DefaultOutput, DefaultParams, ParamValues } from "../../client";
import { TaskQuery } from "../query";

export type ChartProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
> = ChartWithTaskProps<TParams, TOutput> | ConnectedChartProps;

export type ChartWithTaskProps<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput
> = {
  /**
   * The task query to execute. The chart data will be populated by the task's output.
   */
  task: TaskQuery<TParams, TOutput>;
  /**
   * Callback to transform the task output.
   */
  outputTransform?: (output: TOutput) => ConnectedChartProps["data"];
} & SharedChartProps;

export type ConnectedChartProps = {
  /**
   * Data to render in the chart.
   *
   * Supports an array of objects:
   *   [{x: 0, y: 100}, {x: 1, y: 101}, ...]
   * and also an object of arrays:
   *   {x: [0, 1], y: [100, 101]}
   * Use `xAxis` and `datasets` to control which fields are rendered.
   */
  data: ChartData<Datum>;
} & SharedChartProps;

export type SharedChartProps = {
  /**
   * Type of chart.
   */
  type?: "scatter" | "line" | "bar" | "pie";

  /**
   * The ID referenced by the global component state.
   */
  id?: string;
  /**
   * Renders an error message.
   */
  error?: string;
  /**
   * Renders a loading indicator when true.
   */
  loading?: boolean;
  /**
   * Title to show above the chart.
   */
  title?: string;
  /**
   * Position of the legend.
   * @default right
   */
  legendPosition?: "left" | "right" | "top" | "bottom" | "hidden";
} & (ScatterProps | LineProps | BarProps | PieProps) &
  CommonLayoutProps &
  CommonStylingProps;

export type ChartData<T> = Record<string, T>[] | Record<string, T[]>;

export type AxisType =
  | "auto"
  | "linear"
  | "log"
  | "date"
  | "category"
  | "multicategory";

type ScatterProps = {
  type: "scatter";
} & SeriesPlotProps;

type LineProps = {
  type: "line";
} & SeriesPlotProps;

export type BarProps = {
  type: "bar";
  /**
   * The variant of the bar graph.
   * @default group
   */
  mode?: "group" | "stack";
} & SeriesPlotProps;

export type Range = [unknown, unknown] | "tozero";
interface SeriesPlotProps {
  /**
   * Which field of `data` to use for the chart's x-axis.
   * @default First field found in `data`
   */
  xAxis?: string;
  /**
   * Which fields of `data` to use in the chart. Each field is a separate series.
   * @default All fields in `data` aside from xAxis
   */
  datasets?: string[];
  /**
   * Override colors used to render datasets. Key is a dataset name and value is a supported color.
   *
   * Color can either be a built-in color:
   * `"orange" | "yellow" | "lime" | "green" | "teal" | "cyan" | "blue" | "indigo" | "violet" | "grape" | "pink" | "red" | "gray" | "dark"`
   * Or a custom CSS color:
   * `"rgba(1, 2, 3, 0.5)" | "#efefef"`
   */
  colors?: Record<string, string>;
  /**
   * Title for the x-axis.
   */
  xAxisTitle?: string;
  /**
   * Formatting for x-axis values. Uses [d3-format](https://github.com/d3/d3-format) for numerical
   * values and [d3-time-format](https://github.com/d3/d3-time-format) for date values.
   *
   * For example, use `.1%` to render `0.23` as `23%` or `%B %d, %Y` to render a date as
   * `June 30, 2020`
   */
  xAxisFormat?: string;
  /**
   * Type of x-axis.
   * @default auto
   */
  xAxisType?: AxisType;
  /**
   * A custom range for the x-axis from the first element to the second element.
   * This can also be set to "tozero" which sets the start of the range to 0 and auto-calculates the end.
   * If not set, the range is auto-calculated based on the extrema of the input data.
   * @example [0, 100]
   * @example ["2016-07-01","2016-12-31"]
   * @example "tozero"
   */
  xAxisRange?: Range;
  /**
   * Title for the y-axis.
   */
  yAxisTitle?: string;
  /**
   * Formatting for y-axis values, similar to xAxisFormat. See xAxisFormat for details.
   */
  yAxisFormat?: string;
  /**
   * Type of y-axis.
   * @default auto
   */
  yAxisType?: AxisType;
  /**
   * A custom range for the y-axis from the first element to the second element.
   * This can also be set to "tozero" which sets the start of the range to 0 and auto-calculates the end.
   * If not set, the range is auto-calculated based on the extrema of the input data.
   * @example [0, 100]
   * @example ["2016-07-01","2016-12-31"]
   * @example "tozero"
   */
  yAxisRange?: Range;
}

interface PieProps {
  type: "pie";
  /**
   * Which field of `data` to use in the pie chart.
   * @default First field found in `data`
   */
  dataset?: string;
  /**
   * Override colors used to render `data`. Array of colors corresponding to value in `data`.
   *
   * Color can either be a built-in color:
   * `"orange" | "yellow" | "lime" | "green" | "teal" | "cyan" | "blue" | "indigo" | "violet" | "grape" | "pink" | "red" | "gray" | "dark"`
   * Or a custom CSS color:
   * `"rgba(1, 2, 3, 0.5)" | "#efefef"`
   */
  colors?: string[];
  /**
   * Labels for values in `data`.
   */
  labels?: string[];
}
