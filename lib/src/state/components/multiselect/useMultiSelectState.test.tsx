import { act, renderHook } from "test-utils/react";

import { useMultiSelectState } from "./useMultiSelectState";

describe("useMultiSelectState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useMultiSelectState("id", { initialState: { value: ["foo"] } }),
    );

    expect(result.current.state.value?.length).toBe(1);
    expect(result.current.state.value?.[0]).toBe("foo");

    act(() => {
      result.current.state.setValue(["bar", 3]);
    });
    expect(result.current.state.value?.length).toBe(2);
    expect(result.current.state.value?.[0]).toBe("bar");
    expect(result.current.state.value?.[1]).toBe(3);
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useMultiSelectState("id", { initialState: { disabled: true } }),
    );

    expect(result.current.state.disabled).toBe(true);

    act(() => {
      result.current.state.setDisabled();
    });
    expect(result.current.state.disabled).toBe(true);

    act(() => {
      result.current.state.setDisabled(true);
    });
    expect(result.current.state.disabled).toBe(true);
  });
});
