import airplane from "airplane";
import { rest } from "msw";
import * as React from "react";

import { server } from "client/test-utils/mock";
import { renderHook, waitFor } from "test-utils/react";
import { QueryProvider } from "test-utils/tasks/executeTaskTestUtils";

import { useRefetchTasks } from "./useRefetchTask";
import { useTaskQuery } from "./useTaskQuery";

describe("refetching", () => {
  let query2Calls = 0;
  let query3Calls = 0;
  const TaskQueries = () => {
    useTaskQuery("query2");
    useTaskQuery({ slug: "query3", params: { foo: "bar" } });
    return null;
  };
  const WrapperWithQueries = ({ children }: { children?: React.ReactNode }) => {
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
        return useRefetchTasks();
      },
      { wrapper: WrapperWithQueries },
    );
    await waitFor(() => {
      expect(query2Calls).toBe(1);
    });

    const refetchTasks = result.current;

    refetchTasks({
      slug: "query2",
    });
    await waitFor(() => {
      expect(query2Calls).toBe(2);
    });
  });

  it("refetches multiple queries by slug", async () => {
    const { result } = renderHook(
      () => {
        return useRefetchTasks();
      },
      { wrapper: WrapperWithQueries },
    );

    await waitFor(() => {
      expect(query2Calls).toBe(1);
      expect(query3Calls).toBe(1);
    });

    const refetchTasks = result.current;

    refetchTasks(["query2", "query3"]);
    await waitFor(() => {
      expect(query2Calls).toBe(2);
      expect(query3Calls).toBe(2);
    });
  });

  it("refetches queries by slug and params", async () => {
    const { result } = renderHook(
      () => {
        return useRefetchTasks();
      },
      { wrapper: WrapperWithQueries },
    );

    await waitFor(() => {
      expect(query2Calls).toBe(1);
      expect(query3Calls).toBe(1);
    });

    const refetchTasks = result.current;

    refetchTasks([
      // Params do not match.
      { slug: "query2", params: { foo: "bar" } },
      // Params match.
      { slug: "query3", params: { foo: "bar" } },
    ]);
    await waitFor(() => {
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
        return useRefetchTasks();
      },
      { wrapper: WrapperWithQueries },
    );

    await waitFor(() => {
      expect(query2Calls).toBe(1);
    });

    const refetchTasks = result.current;

    refetchTasks(myTask);

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
        return useRefetchTasks();
      },
      { wrapper: WrapperWithQueries },
    );

    await waitFor(() => {
      expect(query2Calls).toBe(1);
      expect(query3Calls).toBe(1);
    });

    const refetchTasks = result.current;
    refetchTasks([
      // Params do not match.
      { fn: myTask, params: { foo: "bar" } },
      // Params match.
      { fn: myTask2, params: { foo: "bar" } },
    ]);

    await waitFor(() => {
      // query 2 is not refetched because the params did not match.
      expect(query2Calls).toBe(1);
      expect(query3Calls).toBe(2);
    });
  });
});
