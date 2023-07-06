import { useCallback, useMemo, useReducer } from "react";

import { ComponentType, useSyncComponentState } from "state/context/context";

import { reducer } from "./reducer";
import { ButtonState } from "./state";

/**
 * useButton is a hook that creates and manages a Button's state on the
 * Airplane context
 */

export const useButtonState = (id: string): ButtonState => {
  const [internalState, dispatch] = useReducer(reducer, {
    result: null,
  });

  const setResult: ButtonState["setResult"] = useCallback((result) => {
    dispatch({
      type: "setResult",
      result,
    });
  }, []);
  const state: ButtonState = useMemo(
    () => ({
      id,
      result: internalState.result,
      setResult,
      componentType: ComponentType.Button,
    }),
    [id, internalState.result, setResult],
  );
  useSyncComponentState(id, state);

  return state;
};
