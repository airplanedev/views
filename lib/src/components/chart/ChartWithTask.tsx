import { useMemo } from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import {
  SetLatestRunProps,
  useSetLatestRunInTaskQuery,
} from "components/errorBoundary/LatestRunDetails";
import { displayTaskBackedError } from "errors/displayTaskBackedError";
import { useTaskQuery } from "state";

import {
  ConnectedChartProps,
  ChartProps,
  ChartWithTaskProps,
} from "./Chart.types";
import { ConnectedChart } from "./ConnectedChart";

export const ChartWithTask = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  outputTransform,
  task,
  setLatestRun,
  ...chartProps
}: ChartWithTaskProps<TParams, TOutput> & SetLatestRunProps) => {
  const fullQuery = useSetLatestRunInTaskQuery<TParams>(task, setLatestRun);
  const { error, loading, output, runID } = useTaskQuery<TParams, TOutput>(
    fullQuery,
  );
  const data = useOutputToData(output, outputTransform);

  if (error) {
    return displayTaskBackedError({
      error,
      taskSlug: fullQuery.slug,
      runID,
      componentName: "Chart",
    });
  } else {
    return (
      <ConnectedChart {...chartProps} data={data ?? []} loading={loading} />
    );
  }
};

export function doesUseTask<TParams extends ParamValues | undefined, TOutput>(
  props: ChartProps<TParams, TOutput>,
): props is ChartWithTaskProps<TParams, TOutput> {
  return Boolean((props as ChartWithTaskProps<TParams, TOutput>).task);
}

function useOutputToData<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  output?: TOutput,
  outputTransform?: ChartWithTaskProps<TParams, TOutput>["outputTransform"],
): ConnectedChartProps["data"] {
  return useMemo(() => {
    if (!output) return [];
    // We try unwrapping only if the output is of the form
    // { Q1: ... }, as a convenience method for dealing with SQL builtins.
    const unwrapQ1 = (output: TOutput) => {
      if (
        output &&
        !Array.isArray(output) &&
        typeof output === "object" &&
        Object.keys(output).length === 1 &&
        Object.keys(output)[0] === "Q1"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (output as Record<string, any>)["Q1"];
      }
      return output;
    };

    const unwrappedOutput = unwrapQ1(output);
    if (outputTransform) {
      return outputTransform(unwrappedOutput);
    }
    return unwrappedOutput;
  }, [output, outputTransform]);
}
