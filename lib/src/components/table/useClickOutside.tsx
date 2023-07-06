// This file is taken from https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-click-outside/use-click-outside.ts
// with some small bug fixes and simplifications.

import { useEffect, useRef } from "react";

const DEFAULT_EVENTS = ["mousedown", "touchstart"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
) {
  const ref = useRef<T>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: any) => {
      const { target } = event ?? {};
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !target?.hasAttribute("data-ignore-outside-clicks") &&
        // We don't want clicking a select item to register as a "click outside"
        !target?.classList.contains("airplane-Select-item")
      ) {
        handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) =>
      document.addEventListener(fn, listener),
    );

    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) =>
        document.removeEventListener(fn, listener),
      );
    };
  }, [ref, handler, events]);

  return ref;
}
