import type { PlotSelectionEvent } from "plotly.js-basic-dist";
import React from "react";

import { useChartState } from "state/components/chart";
import { useComponentId } from "state/components/useId";

import { ConnectedChartProps } from "./Chart.types";
import { firstField, useNormalizedData } from "./useNormalizedData";

const ChartComponent = React.lazy(() => import("./ChartComponent"));

export const ConnectedChart = ({ ...props }: ConnectedChartProps) => {
  const [selectionIndexes, setSelectionIndexes] = React.useState(
    new Map<string, number[]>(),
  );
  const data = useNormalizedData(props, selectionIndexes);

  const onClearSelection = React.useCallback(() => {
    setSelectionIndexes(new Map<string, number[]>());
  }, [setSelectionIndexes]);

  const id = useComponentId(props.id);
  const { changeSelection } = useChartState(id, {
    onClearSelection,
  });

  let xAxis = "";
  if (
    props.type === "scatter" ||
    props.type === "line" ||
    props.type === "bar"
  ) {
    if (props.data && Array.isArray(props.data) && props.data.length !== 0) {
      xAxis = props?.xAxis ?? firstField(props.data);
    }
  }

  const onSelected = React.useCallback(
    (data: PlotSelectionEvent) => {
      if (
        props.type !== "scatter" &&
        props.type !== "line" &&
        props.type !== "bar"
      ) {
        return;
      }
      const newSelectionIndexes = new Map<string, number[]>();
      for (const point of data.points) {
        if (!newSelectionIndexes.has(point.data.name)) {
          newSelectionIndexes.set(point.data.name, []);
        }
        newSelectionIndexes.get(point.data.name)?.push(point.pointIndex);
      }
      setSelectionIndexes(newSelectionIndexes);
      const selectedPoints = data.points.map((point) => ({
        [xAxis]: point.x,
        [point.data.name]: point.y,
      }));
      changeSelection(selectedPoints);
    },
    [changeSelection, props.type, xAxis],
  );
  const onDeselect = React.useCallback(() => {
    changeSelection([]);
    setSelectionIndexes(new Map<string, number[]>());
  }, [changeSelection]);

  return (
    <React.Suspense fallback={null}>
      <ChartComponent
        {...props}
        normalizedData={data}
        onSelected={onSelected}
        onDeselect={onDeselect}
      />
    </React.Suspense>
  );
};
