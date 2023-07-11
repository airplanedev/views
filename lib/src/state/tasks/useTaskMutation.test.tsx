import airplane from "airplane";
import { rest } from "msw";
import * as React from "react";

import { server } from "client/test-utils/mock";
import { RequestDialogContext } from "components/requestDialog/RequestDialogProvider";
import { describeExpectError } from "test-utils/describeExpectError";
import { setupTaskPermissions } from "test-utils/permissions/permissionsTestUtils";
import { renderHook, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
  QueryProvider,
  renderQueryHook,
} from "test-utils/tasks/executeTaskTestUtils";

import { useTaskMutation } from "./useTaskMutation";
import { useTaskQuery } from "./useTaskQuery";

describe("useTaskMutation", () => {
  beforeEach(() => {
    executeTaskSuccess({ expectedParamValues: { foo: "bar" } });
  });

  it("run succeeds", async () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const { result } = renderQueryHook(() =>
      useTaskMutation({
        slug: "slug",
        params: { foo: "bar" },
        onError,
        onSuccess,
      }),
    );

    const { mutate } = result.current;

    mutate();
    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
      expect(onSuccess).toBeCalledWith(output, runID);
      expect(onError).not.toBeCalled();
    });
  });

  it("run succeeds, onSuccess in mutate", async () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();
    const { result } = renderQueryHook(() =>
      useTaskMutation({
        slug: "slug",
        params: { foo: "bar" },
      }),
    );

    const { mutate } = result.current;

    mutate({ onError, onSuccess });
    await waitFor(() => {
      const { output, runID } = result.current;
      expect(onSuccess).toBeCalledWith(output, runID);
      expect(onError).not.toBeCalled();
    });
  });

  it("run succeeds with just a slug", async () => {
    executeTaskSuccess();
    const { result } = renderQueryHook(() => useTaskMutation({ slug: "slug" }));

    const { mutate } = result.current;

    mutate();

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
    });
  });

  it("run succeeds, passing in params lazily", async () => {
    const { result } = renderQueryHook(() => useTaskMutation("slug"));

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
    });
  });

  it("multiple mutations", async () => {
    const mockOnSuccess = jest.fn();
    const { result } = renderQueryHook(() =>
      useTaskMutation({
        slug: "slug",
        onSuccess: (output, runID) => {
          mockOnSuccess();
        },
      }),
    );

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
    });
    expect(mockOnSuccess.mock.calls.length).toBe(1);

    executeTaskSuccess({
      expectedParamValues: { foo: "bar2" },
      output: "value2",
      runID: "2",
    });

    mutate({ params: { foo: "bar2" } });

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value2");
      expect(error).toBeFalsy();
      expect(runID).toBe("2");
    });
    expect(mockOnSuccess.mock.calls.length).toBe(2);
  });

  it("run succeeds with airplane fn", async () => {
    const myTask = airplane.task(
      {
        slug: "task",
        parameters: {
          foo: {
            type: "shorttext",
          },
        },
      },
      (params) => {
        return "";
      },
    );

    const { result } = renderQueryHook(() =>
      useTaskMutation({ fn: myTask, params: { foo: "bar" } }),
    );

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
    });
  });

  it("run succeeds with airplane fn with just a fn", async () => {
    executeTaskSuccess();
    const myTask = airplane.task(
      {
        slug: "task",
        parameters: {},
      },
      () => {
        return "";
      },
    );

    const { result } = renderQueryHook(() => useTaskMutation(myTask));

    const { mutate } = result.current;

    mutate();

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toBe("value");
      expect(error).toBeFalsy();
      expect(runID).toBe("1");
    });
  });

  describeExpectError(() => {
    it("request but no execute perms", async () => {
      setupTaskPermissions({ execute: false, request: true });
      server.use(
        rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
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
        () => useTaskMutation({ slug: "slug", params: { foo: "bar" } }),
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
          taskSlug: "slug",
          opened: true,
        });
      });
    });
  });

  it("run fails", async () => {
    executeTaskFail();

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderQueryHook(() =>
      useTaskMutation({
        slug: "slug",
        params: { foo: "bar" },
        onError,
        onSuccess,
      }),
    );

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" } });

    await waitFor(() => {
      const { error, loading, output, runID } = result.current;
      expect(loading).toBe(false);
      expect(output).toEqual({ error: "error" });
      expect(error).toEqual({
        message: "error",
        type: "FAILED",
      });
      expect(runID).toBe("1");
      expect(onError).toBeCalledWith(output, error, runID);
      expect(onSuccess).not.toBeCalled();
    });
  });

  it("run fails, onError callback in mutate", async () => {
    executeTaskFail();

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderQueryHook(() =>
      useTaskMutation({
        slug: "slug",
        params: { foo: "bar" },
      }),
    );

    const { mutate } = result.current;

    mutate({ params: { foo: "bar" }, onError, onSuccess });

    await waitFor(() => {
      const { error, output, runID } = result.current;
      expect(onError).toBeCalledWith(output, error, runID);
      expect(onSuccess).not.toBeCalled();
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
          return useTaskMutation({
            slug: "slug",
            refetchTasks: "query2",
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      mutate();
      await waitFor(() => {
        expect(query2Calls).toBe(2);
      });
    });

    it("refetches multiple queries by slug", async () => {
      const { result } = renderHook(
        () => {
          return useTaskMutation({
            slug: "slug",
            refetchTasks: ["query2", "query3"],
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

      mutate();
      await waitFor(() => {
        expect(query2Calls).toBe(2);
        expect(query3Calls).toBe(2);
      });
    });

    it("refetches queries by slug and params", async () => {
      const { result } = renderHook(
        () => {
          return useTaskMutation({
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
          return useTaskMutation({
            slug: "slug",
            refetchTasks: myTask,
          });
        },
        { wrapper: WrapperWithQueries },
      );

      const { mutate } = result.current;

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
          return useTaskMutation({
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

      mutate();
      await waitFor(() => {
        // query 2 is not refetched because the params did not match.
        expect(query2Calls).toBe(1);
        expect(query3Calls).toBe(2);
      });
    });
  });
});
