import { ParamValues, DefaultParams } from "client/executeTask";
import {
  getRunbookFullMutation,
  ExecuteError,
  RefetchQuery,
  RunbookMutation,
} from "components/query";

import { useTaskOrRunbookMutation } from "./useTaskOrRunbookMutation";

export type RunbookMutationHookOptions<
  TParams extends ParamValues | undefined = DefaultParams,
> = {
  /**
   * The params of the runbook to execute.
   */
  params?: TParams;
  /**
   * If set, the provided tasks will be refetched on success.
   *
   * This can be useful if you expect the runbook mutation to invalidate data.
   */
  refetchTasks?: RefetchQuery | RefetchQuery[];
  /**
   * Callback on successful runbook execution.
   */
  onSuccess?: (sessionID: string) => void;
  /**
   * Callback on failed runbook execution.
   */
  onError?: (error: ExecuteError, sessionID?: string) => void;
};

export type RunbookMutationFn<
  TParams extends ParamValues | undefined = DefaultParams,
> = (options?: RunbookMutationHookOptions<TParams>) => void;

export type RunbookMutationState = {
  /**
   * Will be true when the runbook is currently executing.
   */
  loading?: boolean;
  /**
   * Will be set with the error message if the runbook failed to execute.
   */
  error?: ExecuteError;
  /**
   * The ID of the session.
   */
  sessionID?: string;
};

export type RunbookMutationResult<
  TParams extends ParamValues | undefined = DefaultParams,
> = {
  /**
   * Function that executes the runbook mutation.
   */
  mutate: RunbookMutationFn<TParams>;
} & RunbookMutationState;

export const useRunbookMutation = <
  TParams extends ParamValues | undefined = DefaultParams,
>(
  mutation: RunbookMutation<TParams>,
): RunbookMutationResult<TParams> => {
  const fullMutation = getRunbookFullMutation<TParams>(mutation);
  const result = useTaskOrRunbookMutation<TParams, null>({
    mutation: fullMutation,
    type: "RUNBOOK",
  });
  switch (result.type) {
    case "RUNBOOK":
      return result.result;
    default:
      throw new Error("invalid result type");
  }
};
