import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { WEB_HOST_GET } from "client/endpoints";
import { Fetcher } from "client/fetcher";
import { ParentMessage } from "message/ParentMessage";

/**
 * useHandleParentMessage is a hook that allows you to listen for messages sent from the parent frame.
 */
export const useHandleParentMessage = (
  callback: (message: ParentMessage) => void,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<ParentMessage>) => {
      const fetcher = new Fetcher();
      const webHost = await queryClient.fetchQuery(
        [WEB_HOST_GET],
        async () => {
          return await fetcher.get<string>(WEB_HOST_GET, {});
        },
        { staleTime: Infinity },
      );
      if (message.origin === webHost) {
        callback(message.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [queryClient, callback]);
};
