import { MantineTheme, useMantineTheme } from "@mantine/core";
import { Data } from "plotly.js-basic-dist";

import { ChartData, ConnectedChartProps } from "./Chart.types";
import { Color } from "../theme/colors";

/**
 * Imposes an opinionated ordering on the colors to use.
 */
const DEFAULT_COLORS: Color[] = [
  "blue",
  "lime",
  "orange",
  "teal",
  "yellow",
  "cyan",
  "violet",
  "red",
];

/**
 * useNormalizedData accepts multiple input types and returns a standardized Plotly Array<Data>.
 */
export const useNormalizedData = (
  props: ConnectedChartProps,
  selectionIndexes: Map<string, number[]> = new Map<string, number[]>(),
): Data[] => {
  const theme = useMantineTheme();
  if (!props.data || (Array.isArray(props.data) && props.data.length === 0)) {
    return [];
  }
  switch (props.type) {
    case "line":
      return seriesData(
        props,
        {
          type: "scatter",
          mode: "lines+markers",
        },
        selectionIndexes,
        theme,
      );
    case "scatter":
      return seriesData(
        props,
        {
          type: "scatter",
          mode: "markers",
        },
        selectionIndexes,
        theme,
      );
    case "bar":
      return seriesData(
        props,
        {
          type: "bar",
        },
        selectionIndexes,
        theme,
      );
    case "pie":
      return pieData(props, theme);
  }
};

/**
 * seriesData handles the common x+y charts: bar, line, scatter
 */
const seriesData = (
  props: ConnectedChartProps & { type: "scatter" | "line" | "bar" },
  plotlyDataOptions: Partial<Data & { type: "scatter" | "bar" }>,
  selectionIndexes: Map<string, number[]>,
  theme: MantineTheme,
): Data[] => {
  const xAxis = props.xAxis ?? firstField(props.data);
  const dataSets = props.datasets ?? fields(props.data).slice(1);
  const x = pluck(props.data, xAxis);
  const hasSelection = selectionIndexes.size > 0;

  return dataSets.map((dataSet, idx) => {
    const colorProp = props.colors?.[dataSet];
    const color = resolveColor(theme, idx, colorProp);
    return {
      type: plotlyDataOptions.type,
      mode: plotlyDataOptions.mode,
      x,
      y: pluck(props.data, dataSet),
      name: dataSet,
      selectedpoints: hasSelection
        ? selectionIndexes.get(dataSet) ?? []
        : undefined,
      marker: {
        color,
      },
    };
  });
};

const pieData = (
  props: ConnectedChartProps & { type: "pie" },
  theme: MantineTheme,
): Data[] => {
  // Unlike e.g. line charts, for pieData we only care about one dataset.
  const dataSet = props.dataset ?? firstField(props.data);

  const colors = (props.colors ?? DEFAULT_COLORS).map((color, idx) =>
    resolveColor(theme, idx, color),
  );
  return [
    {
      type: "pie",
      name: dataSet,
      values: pluck(props.data, dataSet),
      labels: props.labels,
      marker: { colors },
    },
  ];
};

const pluck = <T>(d: ChartData<T>, prop: string) => {
  if (Array.isArray(d)) {
    return d.map((v) => v[prop]);
  } else {
    return d[prop];
  }
};

export const firstField = <T>(data: ChartData<T>) => {
  return fields(data)[0];
};

const fields = <T>(data: ChartData<T>) =>
  Array.isArray(data) ? Object.keys(data[0]) : Object.keys(data);

const resolveColor = (
  theme: MantineTheme,
  idx: number,
  color?: string,
): string => {
  const colorIndex = 6;
  if (!color) {
    return theme.colors[DEFAULT_COLORS[idx]][colorIndex];
  }
  if (!theme.colors[color]) {
    // Assume this is a custom color like rgb(1, 2, 3)
    return color;
  }
  return theme.colors[color][colorIndex];
};
