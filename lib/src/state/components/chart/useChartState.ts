import { useCallback, useMemo, useReducer, Reducer } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer, ReducerState, Action } from "./reducer";
import { ChartState, SelectedPoint } from "./state";

export type ChartHookOptions = {
  /** Callback that triggers when the clearSelection function is called. */
  onClearSelection?: () => void;
};

/**
 * useChartState is a hook that creates and manages a Chart's state on the
 * Airplane context
 */
export const useChartState = (
  id: string,
  options: ChartHookOptions,
): ChartState => {
  const [internalState, dispatch] = useReducer<Reducer<ReducerState, Action>>(
    reducer,
    {
      selectedPoints: [],
    },
  );

  const changeSelection = useCallback((points: SelectedPoint[]) => {
    dispatch({
      type: "changeSelection",
      points,
    });
  }, []);

  const optionsOnClearSelection = options.onClearSelection;
  const clearSelection = useCallback(() => {
    changeSelection([]);
    optionsOnClearSelection?.();
  }, [changeSelection, optionsOnClearSelection]);

  const state: ChartState = useMemo(
    () => ({
      id,
      selectedPoints: internalState.selectedPoints,
      changeSelection,
      clearSelection,
      componentType: ComponentType.Chart,
    }),
    [id, changeSelection, clearSelection, internalState.selectedPoints],
  );
  useSyncComponentState(id, state);

  return state;
};
