import { useMutation as useReactMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { PERMISSIONS_GET } from "client/endpoints";
import {
  executeRunbook,
  ExecuteRunbookError,
  ExecuteRunbookSuccess,
  isExecuteRunbookError,
} from "client/executeRunbook";
import {
  DefaultOutput,
  ParamValues,
  DefaultParams,
  executeTask,
  ExecuteTaskSuccess,
  ExecuteTaskError,
  isExecuteTaskError,
} from "client/executeTask";
import { Fetcher } from "client/fetcher";
import { FullMutation, RunbookFullMutation, getSlug } from "components/query";
import { RequestDialogContext } from "components/requestDialog/RequestDialogProvider";
import { MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX } from "errors/formatErrors";
import { RunnerScaleSignalContext } from "state";

import { useRefetchTasks } from "./useRefetchTask";
import {
  RunbookMutationHookOptions,
  RunbookMutationResult,
} from "./useRunbookMutation";
import { MutationHookOptions, MutationResult } from "./useTaskMutation";

export type TaskOrRunbookMutationResult<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | {
      type: "TASK";
      result: MutationResult<TParams, TOutput>;
    }
  | {
      type: "RUNBOOK";
      result: RunbookMutationResult<TParams>;
    };

export type TaskOrRunbookFullMutation<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> =
  | {
      mutation: FullMutation<TParams, TOutput>;
      type: "TASK";
    }
  | {
      mutation: RunbookFullMutation<TParams>;
      type: "RUNBOOK";
    };

export const useTaskOrRunbookMutation = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  mutation: TaskOrRunbookFullMutation<TParams, TOutput>,
): TaskOrRunbookMutationResult<TParams, TOutput> => {
  const slug = getTaskOrRunbookSlug(mutation);
  const { params, refetchTasks: refetchQuery } = mutation.mutation;

  const refetchTasks = useRefetchTasks();
  const requestDialogContext = useContext(RequestDialogContext);
  const { createScaleSignal } = useContext(RunnerScaleSignalContext);

  useEffect(() => {
    async function warmupTask() {
      if (mutation.type !== "TASK") {
        return;
      }
      await createScaleSignal({
        signalKey: "views_warmup",
        expirationDurationSeconds: 300,
        taskSlug: slug,
      });
    }
    warmupTask();
  }, [slug, mutation.type, createScaleSignal]);

  const { data, error, isLoading, mutate } = useReactMutation<
    ExecuteTaskSuccess<TOutput> | ExecuteRunbookSuccess,
    ExecuteTaskError<TOutput> | ExecuteRunbookError,
    | MutationHookOptions<TParams, TOutput>
    | RunbookMutationHookOptions<TParams>
    | undefined
  >(
    async (opts) => {
      switch (mutation.type) {
        case "TASK": {
          const r = await executeTask<TParams, TOutput>(
            slug,
            "mutation",
            opts?.params ?? params,
          );
          if (isExecuteTaskError<TOutput>(r)) {
            throw r;
          }
          return r;
        }
        case "RUNBOOK": {
          const r = await executeRunbook<TParams>(
            slug,
            "mutation",
            opts?.params ?? params,
          );
          if (isExecuteRunbookError(r)) {
            throw r;
          }
          return r;
        }
        default:
          throw new Error("invalid mutation type");
      }
    },
    {
      onSuccess: (result, opts) => {
        switch (mutation.type) {
          case "TASK": {
            result = result as ExecuteTaskSuccess<TOutput>;
            const taskOnSuccess =
              (opts?.onSuccess as MutationHookOptions["onSuccess"]) ??
              mutation.mutation?.onSuccess;
            taskOnSuccess?.(result.output, result.runID);
            break;
          }
          case "RUNBOOK": {
            result = result as ExecuteRunbookSuccess;
            const runbookOnSuccess =
              (opts?.onSuccess as RunbookMutationHookOptions["onSuccess"]) ??
              mutation.mutation?.onSuccess;
            runbookOnSuccess?.(result.sessionID);
            break;
          }
          default:
            throw new Error("invalid mutation type");
        }

        const refetch = opts?.refetchTasks ?? refetchQuery;
        if (refetch) {
          refetchTasks(refetch);
        }
      },
      onError: async (e, opts) => {
        if (
          e.error.type === "AIRPLANE_INTERNAL" &&
          e.error.message.startsWith(MISSING_EXECUTE_PERMISSIONS_ERROR_PREFIX)
        ) {
          // The user doesn't have permissions to execute this task/runbook.
          // Check if they have permissions to request execution, and if so,
          // show a dialog that allows them to request.
          try {
            const showRequestDialog = await shouldShowRequestDialog(
              slug,
              mutation.type,
            );
            if (showRequestDialog) {
              // Show the request dialog and don't call error handlers.
              requestDialogContext.setState({
                params: opts?.params ?? params ?? {},
                taskSlug: mutation.type === "TASK" ? slug : undefined,
                runbookSlug: mutation.type === "RUNBOOK" ? slug : undefined,
                opened: true,
              });
              return;
            }
          } catch (shouldShowReqErr) {
            if (shouldShowReqErr instanceof Error) {
              e.error.message = `${e.error.message} (error checking request permissions: ${shouldShowReqErr.message})`;
            } else {
              e.error.message = `${e.error.message} (error checking request permissions: ${shouldShowReqErr})`;
            }
          }
        }

        switch (mutation.type) {
          case "TASK": {
            const taskOnError =
              (opts?.onError as MutationHookOptions["onError"]) ??
              mutation.mutation?.onError;
            const err = e as ExecuteTaskError<TOutput>;
            taskOnError?.(err.output, err.error, err.runID);
            return e;
          }
          case "RUNBOOK": {
            const runbookOnError =
              (opts?.onError as RunbookMutationHookOptions["onError"]) ??
              mutation.mutation?.onError;
            const err = e as ExecuteRunbookError;
            runbookOnError?.(err.error, err.sessionID);
            return e;
          }
          default:
            throw new Error("invalid mutation type");
        }
      },
    },
  );

  switch (mutation.type) {
    case "TASK": {
      const taskData = data as ExecuteTaskSuccess<TOutput> | undefined;
      const taskError = error as ExecuteTaskError<TOutput> | undefined;
      return {
        type: mutation.type,
        result: {
          output: taskData?.output ?? taskError?.output,
          runID: taskData?.runID ?? taskError?.runID,
          loading: isLoading,
          mutate,
          error: taskError?.error,
        },
      };
    }
    case "RUNBOOK": {
      const sessionData = data as ExecuteRunbookSuccess | undefined;
      const sessionError = error as ExecuteRunbookError | undefined;
      return {
        type: mutation.type,
        result: {
          sessionID: sessionData?.sessionID ?? sessionError?.sessionID,
          loading: isLoading,
          mutate,
          error: sessionError?.error,
        },
      };
    }
  }
};

const shouldShowRequestDialog = async (
  slug: string,
  mutationType: "TASK" | "RUNBOOK",
): Promise<boolean> => {
  if (mutationType === "TASK") {
    const fetcher = new Fetcher();
    const result = await fetcher.get<{
      resource: Record<string, boolean>;
    }>(PERMISSIONS_GET, {
      task_slug: slug,
      actions: ["tasks.request_run"],
    });
    if (result.resource["tasks.request_run"]) {
      return true;
    }
  } else if (mutationType === "RUNBOOK") {
    const fetcher = new Fetcher();
    const result = await fetcher.get<{
      resource: Record<string, boolean>;
    }>(PERMISSIONS_GET, {
      runbook_slug: slug,
      actions: ["trigger_requests.create"],
    });
    if (result.resource["trigger_requests.create"]) {
      return true;
    }
  }
  return false;
};

const getTaskOrRunbookSlug = <
  TParams extends ParamValues | undefined = DefaultParams,
>(
  mutation: TaskOrRunbookFullMutation<TParams>,
): string => {
  switch (mutation.type) {
    case "TASK":
      return getSlug(mutation.mutation);
    case "RUNBOOK":
      return mutation.mutation.slug;
    default:
      throw new Error("invalid mutation type");
  }
};
