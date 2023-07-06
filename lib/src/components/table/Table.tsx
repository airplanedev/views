import { useState } from "react";

import { DefaultOutput, DefaultParams, ParamValues } from "client";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { LatestRun } from "components/errorBoundary/LatestRunDetails";

import { ConnectedTable } from "./ConnectedTable";
import { TableProps } from "./Table.types";
import { doesUseTask, TableWithTask } from "./TableWithTask";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const Table = <
  TRowData extends object = Record<string, any>,
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  props: TableProps<TRowData, TParams, TOutput>,
) => {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const usesTask = doesUseTask<TRowData, TParams, TOutput>(props);
  const [latestRun, setLatestRun] = useState<LatestRun>();

  if (usesTask) {
    return (
      <ComponentErrorBoundary
        componentName={Table.displayName}
        latestRun={latestRun}
      >
        <TableWithTask {...props} setLatestRun={setLatestRun} />
      </ComponentErrorBoundary>
    );
  } else {
    return (
      <ComponentErrorBoundary componentName={Table.displayName}>
        <ConnectedTable {...props} />
      </ComponentErrorBoundary>
    );
  }
};

Table.displayName = "Table";
