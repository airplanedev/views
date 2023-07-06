import { act, renderHook } from "test-utils/react";

import { useDatePickerState } from "./useDatePickerState";

describe("useDatePickerState", () => {
  const d = new Date(2022, 2);
  const d2 = new Date(2022, 1);
  it("sets value", () => {
    const { result } = renderHook(() =>
      useDatePickerState("id", { initialState: { value: d } }),
    );

    expect(result.current.state.value).toBe(d);

    act(() => {
      result.current.state.setValue(d2);
    });
    expect(result.current.state.value).toBe(d2);
  });

  it("sets null value", () => {
    const { result } = renderHook(() =>
      useDatePickerState("id", { initialState: { value: d } }),
    );

    act(() => {
      result.current.state.setValue(undefined);
    });
    expect(result.current.state.value).toBe(undefined);
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useDatePickerState("id", { initialState: { disabled: true } }),
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
