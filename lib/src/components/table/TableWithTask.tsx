import { useMemo } from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import {
  SetLatestRunProps,
  useSetLatestRunInTaskQuery,
} from "components/errorBoundary/LatestRunDetails";
import { getFullMutation } from "components/query";
import { displayTaskBackedError } from "errors/displayTaskBackedError";
import { useTaskQuery } from "state";

import { ConnectedTable } from "./ConnectedTable";
import {
  TableComponentProps,
  TableProps,
  TableWithTaskProps,
} from "./Table.types";

/**
 * TableWithTask is a connected table that can directly populate its data from a task.
 */
export const TableWithTask = <
  TRowData extends object,
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>({
  outputTransform,
  task,
  rowActions,
  setLatestRun,
  ...tableProps
}: TableWithTaskProps<TRowData, TParams, TOutput> & SetLatestRunProps) => {
  const fullQuery = useSetLatestRunInTaskQuery<TParams>(task, setLatestRun);
  const { error, loading, output, runID } = useTaskQuery<TParams, TOutput>(
    fullQuery,
  );
  const data = useOutputToData(output, outputTransform);

  let arrayRowActions = rowActions
    ? Array.isArray(rowActions)
      ? rowActions
      : [rowActions]
    : [];
  // Update the refetchTasks of each TaskRowAction (if not explicitly set)
  // to refetch the table task.
  arrayRowActions = arrayRowActions.map((rowAction) => {
    // If the row action is ComponentRowAction or BasicRowAction, ignore.
    if (typeof rowAction === "function") {
      return rowAction;
    }
    if (
      typeof rowAction !== "string" &&
      !("slug" in rowAction) &&
      !("fn" in rowAction)
    ) {
      return rowAction;
    }

    const fullMutation = getFullMutation(rowAction);
    if (!fullMutation.refetchTasks) {
      fullMutation.refetchTasks = task;
    }
    return fullMutation;
  });

  if (error) {
    return displayTaskBackedError({
      error,
      taskSlug: fullQuery.slug,
      runID,
      componentName: "Table",
    });
  } else {
    return (
      <ConnectedTable
        {...tableProps}
        data={data}
        loading={loading}
        // key is necessary for React to recognize this as a separate Table
        // instance. This allows initialization to happen again when the data
        // is ready, allowing for accurate initialState values.
        key={
          loading && !!tableProps.isDefaultSelectedRow ? "loading" : undefined
        }
        rowActions={arrayRowActions}
      />
    );
  }
};

function useOutputToData<
  TRowData extends object,
  TParams extends ParamValues,
  TOutput,
>(
  output?: TOutput,
  outputTransform?: TableWithTaskProps<
    TRowData,
    TParams,
    TOutput
  >["outputTransform"],
): TableComponentProps<TRowData>["data"] {
  return useMemo(() => {
    if (!output) return [];
    // We try unwrapping only if the output is of the form
    // { Q1: [...] }, as a convenience method for dealing with SQL builtins.
    const unwrapQ1 = (output: TOutput) => {
      if (
        output &&
        !Array.isArray(output) &&
        typeof output === "object" &&
        Object.keys(output).length === 1 &&
        Object.keys(output)[0] === "Q1" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.isArray((output as Record<string, any>)["Q1"])
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (output as Record<string, any>)["Q1"];
      }
      return output;
    };

    const unwrappedOutput = unwrapQ1(output);
    const transformedOutput = outputTransform
      ? outputTransform(unwrappedOutput)
      : unwrappedOutput;

    if (Array.isArray(transformedOutput)) {
      return transformedOutput;
    }
    return [];
  }, [output, outputTransform]);
}

export function doesUseTask<
  TRowData extends object,
  TParams extends ParamValues | undefined,
  TOutput,
>(
  props: TableProps<TRowData, TParams, TOutput>,
): props is TableWithTaskProps<TRowData, TParams, TOutput> {
  return Boolean(
    (props as TableWithTaskProps<TRowData, TParams, TOutput>).task,
  );
}
