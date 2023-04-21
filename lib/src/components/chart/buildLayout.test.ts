import { buildLayout } from "./buildLayout";

const BASE_LAYOUT = {
  clickmode: "event+select",
  font: {
    color: "#374151",
    family:
      "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    size: 12,
  },
  legend: {
    orientation: "v",
    x: 1.05,
    xanchor: "left",
    y: 0.5,
  },
  margin: {
    b: 32,
    l: 16,
    pad: 2,
    r: 24,
    t: 0,
  },
  showlegend: true,
  xaxis: {
    title: undefined,
    automargin: true,
    fixedrange: true,
    tickformat: undefined,
    type: "-",
    zerolinecolor: "#DEDEDE",
  },
  yaxis: {
    title: undefined,
    automargin: true,
    fixedrange: true,
    tickformat: undefined,
    type: "-",
    zerolinecolor: "#DEDEDE",
  },
};

const checkLayout = (actual: unknown, expected: Record<string, unknown>) => {
  expect(actual).toEqual({
    ...BASE_LAYOUT,
    ...expected,
  });
};

describe("buildLayout", () => {
  it("builds layout for scatter", async () => {
    const layout = buildLayout({
      type: "scatter",
      xAxisFormat: "%m",
      xAxisType: "linear",
      yAxisFormat: ".0%",
      yAxisType: "log",
    });
    checkLayout(layout, {
      xaxis: {
        ...BASE_LAYOUT.xaxis,
        type: "linear",
        tickformat: "%m",
      },
      yaxis: {
        ...BASE_LAYOUT.yaxis,
        type: "log",
        tickformat: ".0%",
      },
    });
  });

  it("builds layout with title", async () => {
    const layout = buildLayout({
      type: "scatter",
      xAxisTitle: "x date",
      yAxisTitle: "y axis",
    });
    checkLayout(layout, {
      xaxis: {
        ...BASE_LAYOUT.xaxis,
        title: { standoff: 20, text: "x date" },
      },
      yaxis: {
        ...BASE_LAYOUT.yaxis,
        title: { standoff: 20, text: "y axis" },
      },
    });
  });

  it("builds layout for line", async () => {
    const layout = buildLayout({
      type: "line",
      xAxisType: "linear",
      yAxisType: "log",
      xAxisRange: "tozero",
      yAxisRange: [0, 100],
    });
    checkLayout(layout, {
      xaxis: {
        ...BASE_LAYOUT.xaxis,
        type: "linear",
        rangemode: "tozero",
      },
      yaxis: {
        ...BASE_LAYOUT.yaxis,
        type: "log",
        range: [0, 100],
      },
    });
  });

  it("builds layout for bar", async () => {
    const layout = buildLayout({
      type: "bar",
      xAxisType: "category",
      yAxisType: "linear",
    });
    checkLayout(layout, {
      xaxis: {
        ...BASE_LAYOUT.xaxis,
        type: "category",
      },
      yaxis: {
        ...BASE_LAYOUT.yaxis,
        type: "linear",
      },
    });
  });

  it("builds layout for pie", async () => {
    const layout = buildLayout({ type: "pie" });
    const { xaxis: _1, yaxis: _2, ...rest } = BASE_LAYOUT;
    expect(layout).toEqual(rest);
  });

  it("builds layout for legend positions", async () => {
    expect(
      buildLayout({ type: "line", legendPosition: "hidden" })
    ).toMatchObject({
      showlegend: false,
    });
    expect(buildLayout({ type: "line", legendPosition: "left" })).toMatchObject(
      {
        showlegend: true,
        legend: { xanchor: "left", orientation: "v" },
      }
    );
    expect(
      buildLayout({ type: "line", legendPosition: "right" })
    ).toMatchObject({
      showlegend: true,
      legend: { xanchor: "left", orientation: "v" },
    });
    expect(buildLayout({ type: "line", legendPosition: "top" })).toMatchObject({
      showlegend: true,
      legend: { xanchor: "center", orientation: "h" },
    });
    expect(
      buildLayout({ type: "line", legendPosition: "bottom" })
    ).toMatchObject({
      showlegend: true,
      legend: { xanchor: "center", orientation: "h" },
    });
  });

  it("defaults legend and axis types", async () => {
    expect(
      buildLayout({
        type: "line",
      })
    ).toMatchObject({
      showlegend: true,
      legend: { xanchor: "left", orientation: "v" },
      xaxis: { type: "-" },
      yaxis: { type: "-" },
    });
  });
});
