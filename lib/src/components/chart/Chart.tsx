import { useState } from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { LatestRun } from "components/errorBoundary/LatestRunDetails";

import { ChartProps } from "./Chart.types";
import { doesUseTask, ChartWithTask } from "./ChartWithTask";
import { ConnectedChart } from "./ConnectedChart";

export const Chart = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: ChartProps<TParams, TOutput>,
) => {
  const usesTask = doesUseTask<TParams, TOutput>(props);
  const [latestRun, setLatestRun] = useState<LatestRun>();

  if (usesTask) {
    return (
      <ComponentErrorBoundary
        componentName={Chart.displayName}
        latestRun={latestRun}
      >
        <ChartWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={Chart.displayName}>
        <ConnectedChart {...props} />
      </ComponentErrorBoundary>
    );
  }
};

Chart.displayName = "Chart";
