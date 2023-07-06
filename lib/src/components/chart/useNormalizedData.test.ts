import { renderHook } from "@testing-library/react";

import { useNormalizedData } from "./useNormalizedData";

describe("useNormalizedData", () => {
  it("normalizes object for scatter", async () => {
    const { result } = renderHook(() =>
      useNormalizedData({
        type: "scatter",
        data: {
          x: [0, 1, 2],
          y: [1, 2, 3],
          z: [4, 5, 6],
        },
      }),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toMatchObject({
      type: "scatter",
      mode: "markers",
      name: "y",
      x: [0, 1, 2],
      y: [1, 2, 3],
    });
    expect(result.current[1]).toMatchObject({
      type: "scatter",
      mode: "markers",
      name: "z",
      x: [0, 1, 2],
      y: [4, 5, 6],
    });
  });

  it("normalizes array for scatter", async () => {
    const { result } = renderHook(() =>
      useNormalizedData({
        type: "scatter",
        data: [
          { x: 0, y: 1, z: 4 },
          { x: 1, y: 2, z: 8 },
          { x: 2, y: 4, z: 8 },
        ],
      }),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toMatchObject({
      type: "scatter",
      mode: "markers",
      name: "y",
      x: [0, 1, 2],
      y: [1, 2, 4],
    });
    expect(result.current[1]).toMatchObject({
      type: "scatter",
      mode: "markers",
      name: "z",
      x: [0, 1, 2],
      y: [4, 8, 8],
    });
  });

  it("normalizes array for line", async () => {
    const { result } = renderHook(() =>
      useNormalizedData({
        type: "line",
        data: [
          { x: 0, y: 1, z: 4 },
          { x: 1, y: 2, z: 8 },
          { x: 2, y: 4, z: 8 },
        ],
      }),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toMatchObject({
      type: "scatter",
      mode: "lines+markers",
      name: "y",
      x: [0, 1, 2],
      y: [1, 2, 4],
    });
    expect(result.current[1]).toMatchObject({
      type: "scatter",
      mode: "lines+markers",
      name: "z",
      x: [0, 1, 2],
      y: [4, 8, 8],
    });
  });

  it("normalizes object for bar", async () => {
    const { result } = renderHook(() =>
      useNormalizedData({
        type: "bar",
        data: {
          x: ["a", "b", "c"],
          y: [1, 2, 3],
          z: [4, 5, 6],
        },
      }),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toMatchObject({
      type: "bar",
      name: "y",
      x: ["a", "b", "c"],
      y: [1, 2, 3],
    });
    expect(result.current[1]).toMatchObject({
      type: "bar",
      name: "z",
      x: ["a", "b", "c"],
      y: [4, 5, 6],
    });
  });

  it("normalizes array for pie", async () => {
    const { result } = renderHook(() =>
      useNormalizedData({
        type: "pie",
        data: {
          size: [10, 10, 20],
        },
        labels: ["a", "b", "c"],
      }),
    );
    expect(result.current.length).toEqual(1);
    expect(result.current[0]).toMatchObject({
      type: "pie",
      name: "size",
      values: [10, 10, 20],
      labels: ["a", "b", "c"],
    });
  });

  it("handles selected points for scatter", async () => {
    const selectionIndexes = new Map<string, number[]>([
      ["y", [0, 2]],
      ["z", [1]],
    ]);
    const { result } = renderHook(() =>
      useNormalizedData(
        {
          type: "scatter",
          data: [
            { x: 0, y: 1, z: 4 },
            { x: 1, y: 2, z: 8 },
            { x: 2, y: 4, z: 8 },
          ],
        },
        selectionIndexes,
      ),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toEqual(
      expect.objectContaining({
        name: "y",
        selectedpoints: [0, 2],
      }),
    );
    expect(result.current[1]).toEqual(
      expect.objectContaining({
        name: "z",
        selectedpoints: [1],
      }),
    );
  });

  it("handles selected points for line", async () => {
    const selectionIndexes = new Map<string, number[]>([
      ["y", [0, 2]],
      ["z", [1]],
    ]);
    const { result } = renderHook(() =>
      useNormalizedData(
        {
          type: "line",
          data: [
            { x: 0, y: 1, z: 4 },
            { x: 1, y: 2, z: 8 },
            { x: 2, y: 4, z: 8 },
          ],
        },
        selectionIndexes,
      ),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toEqual(
      expect.objectContaining({
        name: "y",
        selectedpoints: [0, 2],
      }),
    );
    expect(result.current[1]).toEqual(
      expect.objectContaining({
        name: "z",
        selectedpoints: [1],
      }),
    );
  });

  it("handles selected points for bar", async () => {
    const selectionIndexes = new Map<string, number[]>([
      ["y", [0, 2]],
      ["z", [1]],
    ]);
    const { result } = renderHook(() =>
      useNormalizedData(
        {
          type: "bar",
          data: {
            x: ["a", "b", "c"],
            y: [1, 2, 3],
            z: [4, 5, 6],
          },
        },
        selectionIndexes,
      ),
    );
    expect(result.current.length).toEqual(2);
    expect(result.current[0]).toEqual(
      expect.objectContaining({
        name: "y",
        selectedpoints: [0, 2],
      }),
    );
    expect(result.current[1]).toEqual(
      expect.objectContaining({
        name: "z",
        selectedpoints: [1],
      }),
    );
  });
});
