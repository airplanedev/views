// @ts-nocheck
import { renderHook } from "test-utils/react";
import { QueryProvider } from "test-utils/tasks/executeTaskTestUtils";

import { getRoutingCalls } from "./routerTestUtils";
import { useRouter } from "./useRouter";

describe("useRouter", () => {
  let location: (typeof window)["location"];
  let top: (typeof window)["top"];
  let self: (typeof window)["self"];

  beforeEach(() => {
    location = window.location;
    top = window.top;
    self = window.self;
  });

  afterEach(() => {
    delete window.location;
    delete window.top;
    delete window.self;
    window.location = location;
    window.top = top;
    window.self = self;
  });

  // Since our inIframe check is based on window.top and window.self differing, we set them to different values here
  // to mock being in an iframe.
  const mockInIframe = () => {
    delete window.self;
    window.self = "foo";
    delete window.top;
    window.top = "bar";
  };

  describe("params", () => {
    it("with no window", async () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      expect(result.current.params).toEqual({});
    });

    it("in iframe", async () => {
      const mockLocation = new URL("https://example.com#foo=bar&baz=quux");
      delete window.location;
      window.location = mockLocation;
      mockInIframe();

      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      expect(result.current.params).toEqual({ foo: "bar", baz: "quux" });
    });

    it("out of iframe", async () => {
      const mockLocation = new URL("https://example.com#foo=bar");
      delete window.location;
      window.location = mockLocation;

      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      expect(result.current.params).toEqual({ foo: "bar" });
    });
  });

  describe("navigate", () => {
    beforeEach(() => {
      delete window.top.location;
      window.top.location = { href: "" };
      getRoutingCalls();
    });

    it("to a view", async () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      await result.current.navigate({ view: "myView" });

      expect(window.top.location.href).toBe(
        "https://app.airplane.dev/views/id?",
      );
    });

    it("to a task", async () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      await result.current.navigate({ task: "myTask" });

      expect(window.top.location.href).toBe(
        "https://app.airplane.dev/tasks/id?",
      );
    });

    it("navigates to the same view with new query params", async () => {
      window.parent.postMessage = jest.fn();
      mockInIframe();

      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      await result.current.navigate({ params: { test: "test" } });
      expect(window.parent.postMessage).toBeCalledWith(
        { type: "update_query_params", params: { test: "test" } },
        "*",
      );
    });
  });

  describe("peek", () => {
    beforeEach(() => {
      window.parent.postMessage = jest.fn();
      mockInIframe();
    });

    it("peeks a view", () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      result.current.peek({ view: "myView" });
      expect(window.parent.postMessage).toBeCalledWith(
        { type: "peek", peekType: "view", slug: "myView" },
        "*",
      );
    });

    it("peeks a view with params", () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      result.current.peek({ view: "myView", params: { foo: "bar" } });
      expect(window.parent.postMessage).toBeCalledWith(
        {
          type: "peek",
          peekType: "view",
          slug: "myView",
          params: { foo: "bar" },
        },
        "*",
      );
    });

    it("peeks a task", () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      result.current.peek({ task: "myTask" });
      expect(window.parent.postMessage).toBeCalledWith(
        { type: "peek", peekType: "task", slug: "myTask" },
        "*",
      );
    });

    it("peeks a task with params", () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      result.current.peek({ task: "myTask", params: { foo: "bar" } });
      expect(window.parent.postMessage).toBeCalledWith(
        {
          type: "peek",
          peekType: "task",
          slug: "myTask",
          params: { foo: "bar" },
        },
        "*",
      );
    });

    it("errors when both view and task are provided", async () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      expect(() => {
        result.current.peek({ task: "myTask", view: "myView" });
      }).toThrowError("Cannot specify both view and task");
    });

    it("errors when neither view or task are provided", async () => {
      const { result } = renderHook(() => useRouter(), {
        wrapper: QueryProvider,
      });

      expect(() => {
        result.current.peek({});
      }).toThrowError("Must specify view or task");
    });
  });
});
