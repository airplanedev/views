import { isEqual } from "lodash-es";

import { MutationState } from "state/tasks/useTaskMutation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Result = MutationState<any>;

export type Action<TRowData> =
  | {
      type: "changeRowSelection";
      rows: TRowData[];
    }
  | {
      type: "setRowActionResult";
      result: Result;
    };

export type ReducerState<TRowData> = {
  selectedRows: TRowData[];
  selectedRow?: TRowData;
  rowActionResult: Result | null;
};

export const reducer = <TRowData>(
  state: ReducerState<TRowData>,
  action: Action<TRowData>,
): ReducerState<TRowData> => {
  switch (action.type) {
    case "changeRowSelection": {
      const { rows } = action;

      if (
        rows.length === state.selectedRows.length &&
        rows.every((row, index) => isEqual(row, state.selectedRows[index]))
      ) {
        return state;
      }
      return {
        ...state,
        selectedRows: rows,
        selectedRow: rows.length === 1 ? rows[0] : undefined,
      };
    }
    case "setRowActionResult": {
      return {
        ...state,
        rowActionResult: action.result,
      };
    }
    default:
      throw new Error("invalid action");
  }
};
