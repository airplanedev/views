import { createStyles } from "@mantine/core";
import { useCallback } from "react";

import { DefaultParams, ParamValues } from "client";
import { ButtonComponent } from "components/button/Button";
import { CalloutComponent } from "components/callout/Callout";
import { CodeInput } from "components/codeinput/CodeInput";
import { HeadingComponent } from "components/heading/Heading";
import { XCircleIconMini } from "components/icon";
import { ExecuteError, getFullQuery } from "components/query";
import { TaskQuery } from "components/query";
import { StackComponent } from "components/stack/Stack";
import { sendViewMessage } from "message/sendViewMessage";

const useStyles = createStyles((theme) => ({
  runBadge: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[1],
    color: theme.colors.gray[6],
    fontFamily: theme.fontFamilyMonospace,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    border: "none",
    transition: "background-color 0.2s",
    "&:hover": { backgroundColor: theme.colors.gray[2] },
  },
  header: { display: "flex", gap: 6, alignItems: "center" },
  callout: { whiteSpace: "pre-wrap" },
}));

export type LatestRun = {
  runID?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output?: any;
  error?: ExecuteError;
};

export const LatestRunDetails = ({ runID, output, error }: LatestRun) => {
  const { classes } = useStyles();

  return (
    <StackComponent spacing="sm">
      <div className={classes.header}>
        <HeadingComponent level={5}>Latest run</HeadingComponent>
        {runID && (
          <ButtonComponent
            compact
            className={classes.runBadge}
            onClick={() =>
              sendViewMessage({
                type: "debug_panel",
                open: true,
                activeTab: "activity",
                runID,
              })
            }
          >
            #{runID}
          </ButtonComponent>
        )}
      </div>
      {error && (
        <CalloutComponent
          icon={<XCircleIconMini color="red.4" />}
          variant="error"
          title={
            error.type === "FAILED"
              ? "Run failed with error"
              : "Internal error occured"
          }
          className={classes.callout}
        >
          {error.message}
        </CalloutComponent>
      )}
      {output && (
        <CodeInput
          value={JSON.stringify(output, null, 2)}
          foldGutter
          lineNumbers
          language="json"
          disabled
          style={{ maxHeight: 230 }}
        />
      )}
    </StackComponent>
  );
};

export type SetLatestRunProps = {
  setLatestRun?: (run?: LatestRun) => void;
};

/**
 * useSetLatestRunInTaskQuery is a hook that sets the latest run ID in a task's
 * onSuccess and onError. Used internally to get run information in a
 * task-backed component's error boundary.
 */
export const useSetLatestRunInTaskQuery = <
  TParams extends ParamValues | undefined = DefaultParams,
>(
  task: TaskQuery<TParams>,
  setLatestRun?: (run: LatestRun) => void,
) => {
  const fullQuery = getFullQuery(task);
  const fullQueryOnSuccess = fullQuery.onSuccess;
  const fullQueryOnError = fullQuery.onError;
  fullQuery.onSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output: any, runID: string) => {
      fullQueryOnSuccess?.(output, runID);
      setLatestRun?.({ output, runID });
    },
    [fullQueryOnSuccess, setLatestRun],
  );

  fullQuery.onError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output: any, error: ExecuteError, runID?: string) => {
      fullQueryOnError?.(output, error, runID);
      setLatestRun?.({ output, error, runID });
    },
    [fullQueryOnError, setLatestRun],
  );
  return fullQuery;
};
