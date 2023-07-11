import { act, renderHook } from "test-utils/react";

import { useSelectState } from "./useSelectState";

describe("useSelectState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useSelectState("id", { initialState: { value: "foo" } }),
    );

    expect(result.current.state.value).toBe("foo");

    act(() => {
      result.current.state.setValue("bar");
    });
    expect(result.current.state.value).toBe("bar");
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useSelectState("id", { initialState: { disabled: true } }),
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
