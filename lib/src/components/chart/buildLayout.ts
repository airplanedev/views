import { Layout } from "plotly.js-basic-dist";

import { AxisType, BarProps, ChartProps, Range } from "./Chart.types";
import { COLORS } from "../theme/colors";

const FONT_FAMILY =
  "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji";
const FONT = {
  family: FONT_FAMILY,
  color: COLORS.gray[7],
  size: 12,
};

export const buildLayout = ({
  legendPosition = "right",
  xAxisType = "auto",
  yAxisType = "auto",
  xAxisRange,
  yAxisRange,
  ...props
}: {
  type: ChartProps["type"];
  legendPosition?: ChartProps["legendPosition"];

  xAxisTitle?: string;
  xAxisType?: AxisType;
  xAxisFormat?: string;
  xAxisRange?: Range;

  yAxisTitle?: string;
  yAxisType?: AxisType;
  yAxisFormat?: string;
  yAxisRange?: Range;
  mode?: BarProps["mode"];
}): Partial<Layout> => {
  const baseLayout: Partial<Layout> = {
    font: FONT,
    margin: {
      t: 0,
      l: 16,
      r: 24,
      b: 32,
      pad: 2,
    },
    clickmode: "event+select",
    barmode: props.mode,
    ...computeLegend(legendPosition),
  };

  switch (props.type) {
    case "pie":
      return {
        ...baseLayout,
      };
    default: {
      const xAxisTitle = props.xAxisTitle
        ? {
            text: props.xAxisTitle,
            standoff: 20,
          }
        : undefined;
      const yAxisTitle = props.yAxisTitle
        ? {
            text: props.yAxisTitle,
            standoff: 20,
          }
        : undefined;
      return {
        ...baseLayout,
        xaxis: {
          title: xAxisTitle,
          type: xAxisType === "auto" ? "-" : xAxisType,
          tickformat: props.xAxisFormat,
          automargin: true,
          fixedrange: true,
          zerolinecolor: "#DEDEDE",
          range: Array.isArray(xAxisRange) ? xAxisRange : undefined,
          rangemode: typeof xAxisRange === "string" ? xAxisRange : undefined,
        },
        yaxis: {
          title: yAxisTitle,
          type: yAxisType === "auto" ? "-" : yAxisType,
          tickformat: props.yAxisFormat,
          automargin: true,
          fixedrange: true,
          zerolinecolor: "#DEDEDE",
          range: Array.isArray(yAxisRange) ? yAxisRange : undefined,
          rangemode: typeof yAxisRange === "string" ? yAxisRange : undefined,
        },
      };
    }
  }
};

const computeLegend = (
  legendPosition: NonNullable<ChartProps["legendPosition"]>
): Partial<Layout> => {
  switch (legendPosition ?? "right") {
    case "left": {
      return {
        showlegend: true,
        legend: {
          xanchor: "left",
          orientation: "v",
          x: -0.1,
          y: 0.5,
        },
      };
    }
    case "right": {
      return {
        showlegend: true,
        legend: {
          xanchor: "left",
          orientation: "v",
          x: 1.05,
          y: 0.5,
        },
      };
    }
    case "top": {
      return {
        showlegend: true,
        legend: {
          xanchor: "center",
          orientation: "h",
          x: 0.5,
          y: 1.1,
        },
      };
    }
    case "bottom": {
      return {
        showlegend: true,
        legend: {
          xanchor: "center",
          orientation: "h",
          x: 0.45,
          y: -0.2,
        },
      };
    }
    case "hidden": {
      return {
        showlegend: false,
      };
    }
  }
};
