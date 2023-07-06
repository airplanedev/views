import { act, renderHook } from "test-utils/react";

import { useTableState } from "./useTableState";

describe("useTableState", () => {
  describe("row selection", () => {
    type Row = { id: string };
    const row1: Row = { id: "1" };
    const row2: Row = { id: "2" };

    it("sets and clears selected rows", () => {
      const { result } = renderHook(() =>
        useTableState<Row>("id", {
          clearSelection: () => {
            result.current.changeRowSelection([]);
          },
        }),
      );

      expect(result.current.selectedRows[0]).toBeFalsy();

      act(() => {
        result.current.changeRowSelection([row1]);
      });
      expect(result.current.selectedRows).toEqual([row1]);

      act(() => {
        result.current.changeRowSelection([row1, row2]);
      });
      expect(result.current.selectedRows).toEqual([row1, row2]);

      act(() => {
        result.current.clearSelection();
      });
      expect(result.current.selectedRows.length).toBe(0);
    });

    it("sets and clears selected rows single selection", () => {
      const { result } = renderHook(() =>
        useTableState<Row>("id", {
          clearSelection: () => {
            result.current.changeRowSelection([]);
          },
          singleSelect: true,
        }),
      );

      expect(result.current.selectedRows[0]).toBeFalsy();

      act(() => {
        result.current.changeRowSelection([row1]);
      });
      expect(result.current.selectedRows).toEqual([row1]);
      expect(result.current.selectedRow).toEqual(row1);

      act(() => {
        result.current.changeRowSelection([row1, row2]);
      });
      expect(result.current.selectedRows).toEqual([row1, row2]);
      expect(result.current.selectedRow).toBeFalsy();

      act(() => {
        result.current.clearSelection();
      });
      expect(result.current.selectedRows.length).toBe(0);
      expect(result.current.selectedRow).toBeFalsy();
    });
  });
});
