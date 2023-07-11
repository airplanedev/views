import { useContext, useMemo } from "react";

import { useComponentId } from "./useId";
import {
  ComponentState,
  ComponentStateContext,
  DefaultComponentState,
} from "../context/context";

/**
 * useComponentState is a hook that reads state on the
 * Airplane context
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useComponentState = <TState extends ComponentState = any>(
  id?: string,
): TState => {
  const stateContext = useContext(ComponentStateContext);
  const componentID = useComponentId(id);
  const componentState = stateContext.components[componentID];
  return useMemo(() => {
    return (componentState || {
      ...DefaultComponentState,
      id: componentID,
    }) as TState;
  }, [componentState, componentID]);
};

/**
 * useComponentStates is a hook that reads the state on multiple
 * components in the Airplane context
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useComponentStates = <TState extends ComponentState = any>(
  ids: string[],
): Record<string, TState> => {
  const stateContext = useContext(ComponentStateContext);
  return useMemo(
    () =>
      ids.reduce(
        (obj, id) =>
          Object.assign(obj, {
            [id]: stateContext.components[id] || {
              ...DefaultComponentState,
              id,
            },
          }),
        {},
      ),
    [ids, stateContext.components],
  );
};
