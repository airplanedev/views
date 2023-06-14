import airplane from "airplane";
import { rest } from "msw";

import { server } from "client/test-utils/mock";
import { act, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
  renderQueryHook,
} from "test-utils/tasks/executeTaskTestUtils";

import { useTaskQuery } from "./useTaskQuery";

describe("useTaskQuery", () => {
  beforeEach(() => {
    executeTaskSuccess({ expectedParamValues: { foo: "bar" } });
  });

  it("run succeeds", async () => {
    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { result } = renderQueryHook(() =>
      useTaskQuery({ slug: "slug", params: { foo: "bar" }, onSuccess, onError })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toBe("value");
      expect(result.current.error).toBeFalsy();
      expect(result.current.runID).toBe("1");
      expect(onSuccess).toBeCalledWith(
        result.current.output,
        result.current.runID
      );
      expect(onError).not.toBeCalled();
    });
  });

  it("run succeeds with just slug", async () => {
    executeTaskSuccess();

    const { result } = renderQueryHook(() => useTaskQuery({ slug: "slug" }));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toBe("value");
      expect(result.current.error).toBeFalsy();
    });
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
      }
    );

    const { result } = renderQueryHook(() =>
      useTaskQuery({ fn: myTask, params: { foo: "bar" } })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toBe("value");
      expect(result.current.error).toBeFalsy();
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
      }
    );

    const { result } = renderQueryHook(() => useTaskQuery(myTask));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toBe("value");
      expect(result.current.error).toBeFalsy();
    });
  });

  it("run fails", async () => {
    executeTaskFail();

    const onError = jest.fn();
    const onSuccess = jest.fn();
    const { result } = renderQueryHook(() =>
      useTaskQuery({ slug: "slug", params: { foo: "bar" }, onSuccess, onError })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toEqual({ error: "error" });
      expect(result.current.error).toEqual({
        message: "error",
        type: "FAILED",
      });
      expect(result.current.runID).toBe("1");
      expect(onError).toBeCalledWith(
        result.current.output,
        result.current.error,
        result.current.runID
      );
      expect(onSuccess).not.toBeCalled();
    });
  });

  it("run cancelled", async () => {
    server.use(
      rest.get("http://api/v0/runs/get", (_, res, ctx) => {
        return res(ctx.json({ taskID: "tsk123", status: "Cancelled" }));
      })
    );

    const { result } = renderQueryHook(() =>
      useTaskQuery({ slug: "slug", params: { foo: "bar" } })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.output).toBe("value");
      expect(result.current.error).toEqual({
        message: "Run cancelled",
        type: "FAILED",
      });
    });
  });

  it("network error", async () => {
    server.use(
      rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
        return res(ctx.status(400, "Oh NO"));
      })
    );

    const { result } = renderQueryHook(() =>
      useTaskQuery({ slug: "slug", params: { foo: "bar" } })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual({
        message: `Failed to execute task "slug": Request failed: 400: Oh NO`,
        type: "CLIENT_ERROR",
      });
      expect(result.current.output).toBeFalsy();
    });
  });

  it("caches", async () => {
    let numCalls = 0;
    server.use(
      rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
        numCalls++;
        return res(ctx.json({ runID: "1" }));
      }),
      rest.get("http://api/v0/runs/getOutputs", (_, res, ctx) => {
        return res(ctx.json({ output: numCalls }));
      })
    );

    let slug = "slug";
    const { rerender, result } = renderQueryHook(() =>
      useTaskQuery({ slug, params: { foo: "bar" } })
    );

    await waitFor(() => {
      expect(numCalls).toBe(1);
      expect(result.current.output).toBe(1);
    });

    slug = "slug2";
    rerender();
    await waitFor(() => {
      expect(numCalls).toBe(2);
      expect(result.current.output).toBe(2);
    });

    slug = "slug";
    rerender();
    await waitFor(() => {
      // Returned from cache - no async network request.
      expect(result.current.output).toBe(1);
      expect(numCalls).toBe(2);
    });
  });

  it("skips", async () => {
    let { result } = renderQueryHook(() =>
      useTaskQuery({ slug: "slug", enabled: false })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    ({ result } = renderQueryHook(() =>
      // @ts-ignore
      useTaskQuery({ slug: "slug", enabled: null })
    ));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();

    ({ result } = renderQueryHook(() =>
      // @ts-ignore
      useTaskQuery({ slug: "slug", enabled: "" })
    ));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();
  });

  it("skips when no slug is provided", async () => {
    const { result } = renderQueryHook(() => useTaskQuery(""));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeFalsy();
    expect(result.current.output).toBeFalsy();
  });

  it("refetches", async () => {
    let numCalls = 0;
    server.use(
      rest.post("http://api/v0/tasks/execute", (req, res, ctx) => {
        numCalls++;
        return res(ctx.json({ runID: "1" }));
      }),
      rest.get("http://api/v0/runs/getOutputs", (_, res, ctx) => {
        return res(ctx.json({ output: numCalls }));
      })
    );

    const { result } = renderQueryHook(() =>
      useTaskQuery({
        slug: "slug",
        params: { foo: "bar" },
      })
    );

    await waitFor(() => {
      expect(result.current.output).toBe(1);
    });

    await act(async () => {
      await result.current.refetch();
    });
    await waitFor(() => {
      expect(result.current.output).toBe(2);
    });
  });
});
