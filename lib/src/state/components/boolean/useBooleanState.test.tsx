import { ComponentType } from "state/context/context";
import { act, renderHook } from "test-utils/react";

import { getUseBooleanState } from "./useBooleanState";

const useBooleanState = getUseBooleanState(ComponentType.Checkbox);

describe("useBooleanState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useBooleanState("id", { initialState: { value: true } }),
    );

    expect(result.current.state.value).toBe(true);

    act(() => {
      result.current.state.setValue(false);
    });
    expect(result.current.state.value).toBe(false);
  });

  it("sets checked", () => {
    const { result } = renderHook(() =>
      useBooleanState("id", { initialState: { value: true } }),
    );

    expect(result.current.state.checked).toBe(true);

    act(() => {
      result.current.state.setChecked(false);
    });
    expect(result.current.state.checked).toBe(false);
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useBooleanState("id", { initialState: { disabled: true } }),
    );

    expect(result.current.state.disabled).toBe(true);

    act(() => {
      result.current.state.setDisabled(false);
    });
    expect(result.current.state.disabled).toBe(false);
  });
});
