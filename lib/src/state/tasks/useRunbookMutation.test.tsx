import airplane from "airplane";
import { rest } from "msw";
import * as React from "react";

import { server } from "client/test-utils/mock";
import { RequestDialogContext } from "components/requestDialog/RequestDialogProvider";
import { setupTaskAndRunbookPermissions } from "test-utils/permissions/permissionsTestUtils";
import { renderHook, waitFor } from "test-utils/react";
import {
  executeRunbookFail,
  executeRunbookSuccess,
  QueryProvider,
  renderQueryHook,
} from "test-utils/tasks/executeTaskTestUtils";

import { useRunbookMutation } from "./useRunbookMutation";
import { useTaskQuery } from "./useTaskQuery";
import { describeExpectError } from "../../test-utils/describeExpectError";

describe("useRunbookMutation", () => {
  beforeEach(() => {
    executeRunbookSuccess({ expectedParamValues: { foo: "bar" } });
  });

  it("session succeeds", async () => {
    const { result } = renderQueryHook(() =>
      useRunbookMutation({ slug: "slug", params: { foo: "bar" } }),
    );

    const { mutate } = result.current;

    mutate();
    await waitFor(() => {
      const { error, loading, sessionID } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeFalsy();
      expect(sessionID).toBe("1");
    });
  });

  it("session succeeds with just a slug", async () => {
    executeRunbookSuccess();
    const { result } = renderQueryHook(() =>
      useRunbookMutation({ slug: "slug" }),
    );

    const { mutate } = result.current;

    mutate();

    await waitFor(() => {
      const { error, loading, sessionID } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeFalsy();
      expect(sessionID).toBe("1");
    });
  });

  it("session succeeds, passing in params lazily", async () => {
    const { result } = renderQueryHook(() => useRunbookMutation("slug"));

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, sessionID } = result.current;
      expect(loading).toBe(false);
      expect(error).toBeFalsy();
      expect(sessionID).toBe("1");
    });
  });

  it("session fails", async () => {
    executeRunbookFail();

    const { result } = renderQueryHook(() =>
      useRunbookMutation({ slug: "slug", params: { foo: "bar" } }),
    );

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, sessionID } = result.current;
      expect(loading).toBe(false);
      expect(error).toEqual({
        message: "Session failed",
        type: "FAILED",
      });
      expect(sessionID).toBe("1");
    });
  });

  describeExpectError(() => {
    it("request but no execute perms", async () => {
      setupTaskAndRunbookPermissions({ execute: false, request: true });
      server.use(
        rest.post("http://api/v0/runbooks/execute", (req, res, ctx) => {
          expect((req.body as { slug: string }).slug).toBeTruthy();
          return res(
            ctx.status(403),
            ctx.json({ error: "Error unauthorized" }),
          );
        }),
      );
      const setState = jest.fn();

      const RequestDialogProvider = ({
        children,
      }: {
        children?: React.ReactNode;
      }) => {
        return (
          <QueryProvider>
            <RequestDialogContext.Provider value={{ setState }}>
              {children}
            </RequestDialogContext.Provider>
          </QueryProvider>
        );
      };

      const { result } = renderHook(
        () => useRunbookMutation({ slug: "slug", params: { foo: "bar" } }),
        { wrapper: RequestDialogProvider },
      );

      const { mutate } = result.current;

      mutate({ params: { foo: "bar" } });

      await waitFor(() => {
        const { error, loading } = result.current;
        expect(loading).toBe(false);
        expect(error).toEqual({
          message: "Missing execute permissions on slug",
          type: "AIRPLANE_INTERNAL",
        });
        expect(setState).toBeCalledWith({
          params: { foo: "bar" },
          runbookSlug: "slug",
          opened: true,
        });
      });
    });
  });

  describe("refetching", () => {
    let query2Calls = 0;
    let query3Calls = 0;
    const TaskQueries = () => {
      useTaskQuery("query2");
      useTaskQuery({ slug: "query3", params: { foo: "bar" } });
      return null;
    };
    const WrapperWithQueries = ({
      children,
    }: {
      children?: React.ReactNode;
    }) => {
      return (
        <QueryProvider>
          <TaskQueries />
          {children}
        </QueryProvider>
      );
    };

    beforeEach(() => {
      executeRunbookSuccess();
      query2Calls = 0;
      query3Calls = 0;
      server.use(
        rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
          const b = req.body as {
            slug: string;
            paramValues?: Record<string, unknown>;
          };
          if (b.slug === "query2") query2Calls++;
          if (b.slug === "query3") query3Calls++;
          return res(ctx.json({ runID: "1" }));
        }),
        rest.get("http://api/v0/runs/get", (_, res, ctx) => {
          return res(ctx.json({ taskID: "tsk123", status: "Succeeded" }));
        }),
        rest.get("http://api/v0/runs/getOutputs", (_, res, ctx) => {
          return res(ctx.json({ output: "value" }));
        }),
      );
    });

    it("refetches a single query by slug", async () => {
      const { result } = renderHook(
        () => {
          return useRunbookMutation({
            slug: "slug",
            refetchTasks: "query2",
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      await waitFor(() => {
        expect(query2Calls).toBe(1);
      });
      mutate();
      await waitFor(() => {
        expect(query2Calls).toBe(2);
      });
    });

    it("refetches multiple queries by slug", async () => {
      const { result } = renderHook(
        () => {
          return useRunbookMutation({
            slug: "slug",
            refetchTasks: ["query2", "query3"],
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      await waitFor(() => {
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(1);
      });
      mutate();
      await waitFor(() => {
        expect(query2Calls).toBe(2);
        expect(query3Calls).toBe(2);
      });
    });

    it("refetches queries by slug and params", async () => {
      const { result } = renderHook(
        () => {
          return useRunbookMutation({
            slug: "slug",
            refetchTasks: [
              // Params do not match.
              { slug: "query2", params: { foo: "bar" } },
              // Params match.
              { slug: "query3", params: { foo: "bar" } },
            ],
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      await waitFor(() => {
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(1);
      });
      mutate();

      await waitFor(() => {
        // query 2 is not refetched because the params did not match.
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(2);
      });
    });

    it("refetches a single query by airplane fn", async () => {
      const myTask = airplane.task(
        {
          slug: "query2",
          parameters: {},
        },
        () => {
          return "";
        },
      );

      const { result } = renderHook(
        () => {
          return useRunbookMutation({
            slug: "slug",
            refetchTasks: myTask,
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      await waitFor(() => {
        expect(query2Calls).toBe(1);
      });
      mutate();
      await waitFor(() => {
        expect(query2Calls).toBe(2);
      });
    });

    it("refetches a single query by airplane fn with params", async () => {
      const myTask = airplane.task(
        {
          slug: "query2",
          parameters: {},
        },
        () => {
          return "";
        },
      );
      const myTask2 = airplane.task(
        {
          slug: "query3",
          parameters: {
            foo: "shorttext",
          },
        },
        () => {
          return "";
        },
      );

      const { result } = renderHook(
        () => {
          return useRunbookMutation({
            slug: "slug",
            refetchTasks: [
              // Params do not match.
              { fn: myTask, params: { foo: "bar" } },
              // Params match.
              { fn: myTask2, params: { foo: "bar" } },
            ],
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      await waitFor(() => {
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(1);
      });
      mutate();
      await waitFor(() => {
        // query 2 is not refetched because the params did not match.
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(2);
      });
    });
  });
});
