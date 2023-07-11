import { isArray } from "lodash-es";
import { useCallback, useEffect, useMemo, useState } from "react";

export type KeyPressProps = {
  /**
   * A key, list of keys, or list of key combinations that should be listened to.
   * e.g. "ENTER", ["ENTER", "TAB"], [["SHIFT", "ENTER"], "TAB"]
   */
  targetKeys:
    | KeyboardEvent["key"]
    | Array<KeyboardEvent["key"] | KeyboardEvent["key"][]>;
  /**
   * If true, key events will be listened to from the window.
   * If false, you need to manually call upHandler and downHandler and have more control over event handling.
   */
  listenToWindow?: boolean;
};

export default function useKeyPress({
  targetKeys,
  listenToWindow,
}: KeyPressProps) {
  const targetKeysArray = useMemo(
    () => (isArray(targetKeys) ? targetKeys : [targetKeys]),
    [targetKeys],
  );
  const [keyPressed, setKeyPressed] = useState(false);
  const [allKeysPressed, setAllKeysPressed] = useState(new Set<string>());

  const handle = useCallback(
    (keysPressed: Set<string>) => {
      const isPressed = targetKeysArray.some((targetKey) => {
        if (typeof targetKey === "string") {
          return keysPressed.has(targetKey);
        }
        return targetKey.every((k) => keysPressed.has(k));
      });
      setKeyPressed(isPressed);
      return isPressed;
    },
    [targetKeysArray],
  );

  const downHandler = useCallback(
    ({ key }: { key: string }) => {
      const newAllKeysPressed = new Set(allKeysPressed);
      newAllKeysPressed.add(key);
      setAllKeysPressed(newAllKeysPressed);
      return handle(newAllKeysPressed);
    },
    [allKeysPressed, handle],
  );

  const upHandler = useCallback(
    ({ key }: { key: string }) => {
      const newAllKeysPressed = new Set(allKeysPressed);
      newAllKeysPressed.delete(key);
      setAllKeysPressed(newAllKeysPressed);
      return handle(newAllKeysPressed);
    },
    [allKeysPressed, handle],
  );

  useEffect(() => {
    if (!listenToWindow) return;
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler, listenToWindow]);

  if (!targetKeys) {
    return { keyPressed: false, upHandler, downHandler };
  }

  return { keyPressed, upHandler, downHandler };
}
