import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { useMemo } from "react";
import * as React from "react";

export type { QueryClientConfig } from "@tanstack/react-query";

export type QueryClientProviderProps = {
  children: React.ReactNode;
  queryClientConfig?: QueryClientConfig;
};

export const QueryClientProvider = ({
  children,
  queryClientConfig,
}: QueryClientProviderProps) => {
  const queryClient = useMemo(
    () => new QueryClient(queryClientConfig),
    [queryClientConfig],
  );
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
};
