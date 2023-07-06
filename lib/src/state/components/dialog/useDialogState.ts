import { useCallback, useMemo, useReducer } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer } from "./reducer";
import { InitialDialogState, DialogState } from "./state";

export type DialogHookOptions = {
  initialState?: InitialDialogState;
};

/**
 * useDialogState is a hook that creates and manages an Dialog's state on the
 * Airplane context
 */
export const useDialogState = (
  id: string,
  options?: DialogHookOptions,
): DialogState => {
  const [internalState, dispatch] = useReducer(reducer, {
    opened: options?.initialState?.opened ?? false,
  });

  const open: DialogState["open"] = useCallback(() => {
    dispatch({
      type: "open",
    });
  }, []);
  const close: DialogState["close"] = useCallback(() => {
    dispatch({
      type: "close",
    });
  }, []);

  const state: DialogState = useMemo(
    () => ({
      id,
      open,
      close,
      opened: internalState.opened,
      componentType: ComponentType.Dialog,
    }),
    [id, internalState.opened, open, close],
  );
  useSyncComponentState(id, state);

  return state;
};
