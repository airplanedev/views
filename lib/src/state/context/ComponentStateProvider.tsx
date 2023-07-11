import { useCallback, useState, useEffect } from "react";
import * as React from "react";

import { sanitizeMessage } from "message/sanitizeMessage";
import { sendViewMessage } from "message/sendViewMessage";

import {
  ComponentState,
  ComponentStateContext,
  ComponentStateContextType,
} from "./context";

export type StateProviderProps = {
  children: React.ReactNode;
};

export const ComponentStateProvider = ({ children }: StateProviderProps) => {
  const [components, setComponents] = useState<Record<string, ComponentState>>(
    {},
  );

  useEffect(() => {
    try {
      const state = sanitizeMessage(components);
      sendViewMessage({
        type: "component_state",
        state,
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "DataCloneError") {
        sendViewMessage({
          type: "component_state",
          state: {},
          error: e.message,
        });
        return;
      }
      throw e;
    }
  }, [components]);

  const updateComponent = useCallback(
    <TState extends ComponentState>(id: string, state: TState) => {
      setComponents((currentComponents) => ({
        ...currentComponents,
        [id]: state,
      }));
    },
    [],
  );

  const removeComponent = useCallback((id: string) => {
    setComponents((currentComponents) => {
      const hasComponent = currentComponents[id];
      if (!hasComponent) return currentComponents;
      const newComponents = { ...currentComponents };
      delete newComponents[id];
      return newComponents;
    });
  }, []);

  const context: ComponentStateContextType = {
    components,
    updateComponent,
    removeComponent,
  };
  return (
    <ComponentStateContext.Provider value={context}>
      {children}
    </ComponentStateContext.Provider>
  );
};
