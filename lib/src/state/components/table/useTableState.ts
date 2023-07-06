import { useCallback, useMemo, useReducer, Reducer } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";
import { MutationState } from "state/tasks/useTaskMutation";

import { reducer, ReducerState, Action } from "./reducer";
import { TableState } from "./state";

export type TableHookOptions = {
  // If true, only a single row can be selected at a time.
  singleSelect?: boolean;
  /** Clear all selected rows. */
  clearSelection: () => void;
};

/**
 * useTableState is a hook that creates and manages a Table's state on the
 * Airplane context
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTableState = <TRowData = any>(
  id: string,
  options: TableHookOptions,
): TableState<TRowData> => {
  const [internalState, dispatch] = useReducer<
    Reducer<ReducerState<TRowData>, Action<TRowData>>
  >(reducer, {
    selectedRows: [],
    rowActionResult: null,
  });

  const changeRowSelection = useCallback((rows: TRowData[]) => {
    dispatch({
      type: "changeRowSelection",
      rows,
    });
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRowActionResult = useCallback((result: MutationState<any>) => {
    dispatch({
      type: "setRowActionResult",
      result,
    });
  }, []);

  const state: TableState<TRowData> = useMemo(
    () => ({
      id,
      selectedRows: internalState.selectedRows,
      selectedRow: internalState.selectedRow,
      rowActionResult: internalState.rowActionResult,
      setRowActionResult,
      changeRowSelection,
      clearSelection: options.clearSelection,
      componentType: ComponentType.Table,
    }),
    [
      id,
      internalState.selectedRows,
      internalState.selectedRow,
      internalState.rowActionResult,
      changeRowSelection,
      setRowActionResult,
      options.clearSelection,
    ],
  );
  useSyncComponentState(id, state);

  return state;
};
