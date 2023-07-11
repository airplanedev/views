import { useCallback } from "react";

import { ParentMessage } from "message/ParentMessage";
import { useHandleParentMessage } from "message/useHandleParentMessage";

/**
 * useToggleModal is a hook that toggles open/closed a modal based on messages sent from the parent frame.
 */
export const useToggleModal = (
  setOpen: (open: boolean) => void,
  id: string,
) => {
  const toggleModal = useCallback(
    (message: ParentMessage) => {
      if (message.type === "toggle_modal" && message.id === id) {
        setOpen(message.open);
      }
    },
    [setOpen, id],
  );
  useHandleParentMessage(toggleModal);
};
