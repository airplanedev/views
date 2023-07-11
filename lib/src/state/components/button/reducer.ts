import { DefaultOutput } from "client";
import { RunbookMutationState } from "state/tasks/useRunbookMutation";
import { MutationState } from "state/tasks/useTaskMutation";

export type Action<TOutput = DefaultOutput> = {
  type: "setResult";
  result: MutationState<TOutput> | RunbookMutationState;
};

export type ReducerState<TOutput = DefaultOutput> = {
  result: MutationState<TOutput> | RunbookMutationState | null;
};

export const reducer = <TOutput = DefaultOutput>(
  state: ReducerState<TOutput>,
  action: Action<TOutput>,
): ReducerState<TOutput> => {
  switch (action.type) {
    case "setResult": {
      const { result } = action;
      return {
        result,
      };
    }
    default:
      throw new Error("invalid action");
  }
};
