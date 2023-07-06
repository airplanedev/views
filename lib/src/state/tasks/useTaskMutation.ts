import { DefaultOutput, ParamValues, DefaultParams } from "client/executeTask";
import {
  ExecuteError,
  TaskMutation,
  getFullMutation,
  RefetchQuery,
} from "components/query";

import { useTaskOrRunbookMutation } from "./useTaskOrRunbookMutation";

export type MutationHookOptions<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * The params of the task to execute.
   */
  params?: TParams;
  /**
   * If set, the provided tasks will be refetched on success.
   *
   * This can be useful if you expect the task mutation to invalidate data.
   */
  refetchTasks?: RefetchQuery | RefetchQuery[];
  /**
   * Callback on successful task execution.
   */
  onSuccess?: (output: TOutput, runID: string) => void;
  /**
   * Callback on failed task execution.
   */
  onError?: (
    output: TOutput | undefined,
    error: ExecuteError,
    runID?: string,
  ) => void;
};

export type MutationFn<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = (options?: MutationHookOptions<TParams, TOutput>) => void;

export type MutationState<TOutput = DefaultOutput> = {
  /**
   * The output of the last successfully executed task.
   */
  output?: TOutput;
  /**
   * Will be true when the task is currently executing.
   */
  loading?: boolean;
  /**
   * Will be set with the error message if the task failed to execute.
   */
  error?: ExecuteError;
  /**
   * The ID of the run.
   */
  runID?: string;
};

export type MutationResult<
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
> = {
  /**
   * Function that executes the task mutation.
   */
  mutate: MutationFn<TParams, TOutput>;
} & MutationState<TOutput>;

/**
 * useTaskMutation executes a task.
 *
 * This should be used for tasks that create/update/delete data.
 */
export const useTaskMutation = <
  TParams extends ParamValues | undefined = DefaultParams,
  TOutput = DefaultOutput,
>(
  mutation: TaskMutation<TParams, TOutput>,
): MutationResult<TParams, TOutput> => {
  const fullMutation = getFullMutation<TParams>(mutation);
  const result = useTaskOrRunbookMutation<TParams, TOutput>({
    mutation: fullMutation,
    type: "TASK",
  });
  switch (result.type) {
    case "TASK":
      return result.result;
    default:
      throw new Error("invalid result type");
  }
};
