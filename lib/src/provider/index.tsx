import { NotificationsProvider } from "@mantine/notifications";
import * as React from "react";

import { ThemeProvider } from "components";
import { RequestDialogProvider } from "components/requestDialog/RequestDialogProvider";
import { getNPMPackageVersion } from "getNPMPackageVersion";
import { sendViewMessage } from "message/sendViewMessage";
import {
  ComponentStateProvider,
  QueryClientConfig,
  QueryClientProvider,
  RunnerScaleSignalProvider,
} from "state";

type ViewProviderProps = {
  children: React.ReactNode;
  queryClientConfig?: QueryClientConfig;
  /** A custom document where views themes should be mounted. Useful when mounting views in an iframe. */
  themeContainerDocument?: Document;
};

const disableQueryConfigRetries = (q: QueryClientConfig | undefined) => {
  const queryClientConfig = q ?? {};
  if (!queryClientConfig.defaultOptions) {
    queryClientConfig.defaultOptions = {};
  }
  if (!queryClientConfig.defaultOptions.queries) {
    queryClientConfig.defaultOptions.queries = {};
  }
  queryClientConfig.defaultOptions.queries.retry = false;
  return queryClientConfig;
};

export const ViewProvider = ({
  children,
  queryClientConfig,
}: ViewProviderProps) => {
  React.useEffect(() => {
    const version = getNPMPackageVersion();
    if (version) {
      sendViewMessage({
        type: "view_init",
        version,
      });
    }
  }, []);

  return (
    <ComponentStateProvider>
      <QueryClientProvider
        queryClientConfig={disableQueryConfigRetries(queryClientConfig)}
      >
        <ThemeProvider>
          <NotificationsProvider position="bottom-right">
            <RequestDialogProvider>
              <RunnerScaleSignalProvider>{children}</RunnerScaleSignalProvider>
            </RequestDialogProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ComponentStateProvider>
  );
};
