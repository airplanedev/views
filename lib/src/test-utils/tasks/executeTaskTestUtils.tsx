import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rest } from "msw";
import * as React from "react";

import { server } from "client/test-utils/mock";
import { renderHook } from "test-utils/react";

export const executeTaskSuccess = (opts?: {
  expectedParamValues?: Record<string, unknown>;
  runID?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output?: any;
}) => {
  server.use(
    rest.post("http://api/v0/runners/createScaleSignal", (req, res, ctx) => {
      return res(ctx.json({}));
    }),
    rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
      const b = req.body as {
        slug: string;
        paramValues?: Record<string, unknown>;
      };
      expect(b.slug).toBeTruthy();
      if (opts?.expectedParamValues) {
        expect(b.paramValues).toEqual(opts.expectedParamValues);
      }
      return res(ctx.json({ runID: opts?.runID ?? "1" }));
    }),
    rest.get("http://api/v0/runs/get", (_, res, ctx) => {
      return res(ctx.json({ taskID: "tsk123", status: "Succeeded" }));
    }),
    rest.get("http://api/v0/runs/getOutputs", (_, res, ctx) => {
      return res(ctx.json({ output: opts?.output ?? "value" }));
    }),
  );
};

export const executeRunbookSuccess = (opts?: {
  expectedParamValues?: Record<string, unknown>;
}) => {
  server.use(
    rest.post("http://api/v0/runbooks/execute", (req, res, ctx) => {
      const b = req.body as {
        slug: string;
        paramValues?: Record<string, unknown>;
      };
      expect(b.slug).toBeTruthy();
      if (opts?.expectedParamValues) {
        expect(b.paramValues).toEqual(opts.expectedParamValues);
      }
      return res(ctx.json({ sessionID: "1" }));
    }),
    rest.get("http://api/v0/sessions/get", (_, res, ctx) => {
      return res(ctx.json({ status: "Succeeded" }));
    }),
  );
};

export const executeTaskFail = () => {
  server.use(
    rest.post("http://api/v0/runners/createScaleSignal", (req, res, ctx) => {
      return res(ctx.json({}));
    }),
    rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
      expect((req.body as { slug: string }).slug).toBeTruthy();
      return res(ctx.json({ runID: "1" }));
    }),
    rest.get("http://api/v0/runs/get", (_, res, ctx) => {
      return res(ctx.json({ taskID: "tsk123", status: "Failed" }));
    }),
    rest.get("http://api/v0/runs/getOutputs", (_, res, ctx) => {
      return res(ctx.json({ output: { error: "error" } }));
    }),
  );
};

export const executeRunbookFail = () => {
  server.use(
    rest.post("http://api/v0/runbooks/execute", (req, res, ctx) => {
      expect((req.body as { slug: string }).slug).toBeTruthy();
      return res(ctx.json({ sessionID: "1" }));
    }),
    rest.get("http://api/v0/sessions/get", (_, res, ctx) => {
      return res(ctx.json({ status: "Failed" }));
    }),
  );
};

export const QueryProvider = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider
    client={
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })
    }
  >
    {children}
  </QueryClientProvider>
);

export const renderQueryHook = <TProps, TResult>(
  callback: (props: TProps) => TResult,
) => {
  return renderHook(callback, { wrapper: QueryProvider });
};
