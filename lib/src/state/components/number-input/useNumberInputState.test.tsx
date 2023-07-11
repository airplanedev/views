import { act, renderHook } from "test-utils/react";

import { useNumberInputState } from "./useNumberInputState";

describe("useNumberInputState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useNumberInputState("id", { initialState: { value: 1 } }),
    );

    expect(result.current.state.value).toBe(1);

    act(() => {
      result.current.state.setValue(-1);
    });
    expect(result.current.state.value).toBe(-1);
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useNumberInputState("id", { initialState: { disabled: true } }),
    );

    expect(result.current.state.disabled).toBe(true);

    act(() => {
      result.current.state.setDisabled(false);
    });
    expect(result.current.state.disabled).toBe(false);

    act(() => {
      result.current.state.setDisabled();
    });
    expect(result.current.state.disabled).toBe(true);
  });
});
