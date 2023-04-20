import { createStyles, Transition } from "@mantine/core";
import Plotly, { Data } from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";

import { Heading } from "components/heading/Heading";
import { Skeleton } from "components/Skeleton";
import { Label } from "components/text/Text";

import { buildLayout } from "./buildLayout";
import { ChartProps } from "./Chart.types";
import { useCommonLayoutStyle } from "../layout/useCommonLayoutStyle";

const NUM_LOADING_LINES = 6;
const Plot = createPlotlyComponent(Plotly);

type ChartComponentProps = ChartProps & {
  normalizedData: Data[];
  onSelected?: (event: Plotly.PlotSelectionEvent) => void;
  onDeselect?: () => void;
};

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.5rem",
  },
  title: {
    alignSelf: "center",
  },
  plot: {
    width: "100%",
    height: "100%",
  },
}));

/**
 * Presentational component. Assumes data fetching, wrangling, etc. has been handled.
 */
const ChartComponent = ({
  onSelected,
  onDeselect,
  title,
  normalizedData,
  className,
  style,
  width,
  height,
  grow,
  loading,
  error,
  ...restProps
}: ChartComponentProps) => {
  const { classes, cx } = useStyles();
  const { classes: layoutClasses } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  // Layout controls the visual aspects of the chart.
  const layout = buildLayout(restProps);

  return (
    <div style={style} className={cx(classes.wrapper, layoutClasses.style)}>
      {
        // Render title using our own component, instead of Plotly's.
        title ? (
          <Heading className={classes.title} level={2}>
            {title}
          </Heading>
        ) : null
      }
      {loading && (
        <div style={{ marginTop: 10, overflow: "hidden" }}>
          {new Array(NUM_LOADING_LINES).fill(0).map((_, index) => (
            <Skeleton
              key={index}
              height={2}
              // If the container's width is set, fill it. If not, use a fixed width.
              width={width != null ? "100%" : 500}
              mb={index < NUM_LOADING_LINES - 1 ? 50 : 0}
            />
          ))}
        </div>
      )}
      {error && (
        <Label
          style={{
            // If the container's width/height is set, fill it. If not, use a fixed width/height.
            width: width != null ? "100%" : 500,
            height: height != null ? "100%" : 200,
          }}
          color="red"
        >
          {error}
        </Label>
      )}
      <Transition
        mounted={!loading && !error}
        transition="pop-bottom-left"
        duration={1000}
        timingFunction="ease"
      >
        {(styles) => (
          <Plot
            style={styles}
            onDeselect={onDeselect}
            onSelected={onSelected}
            data={normalizedData}
            layout={layout}
            useResizeHandler
            config={{
              modeBarButtonsToRemove: ["select2d", "lasso2d"],
            }}
            className={classes.plot}
          />
        )}
      </Transition>
    </div>
  );
};

export default ChartComponent;
