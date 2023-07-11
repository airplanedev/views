import { act, renderHook } from "test-utils/react";

import { useRadioGroupState } from "./useRadioGroupState";

describe("useRadioGroupState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useRadioGroupState("id", { initialState: { value: "foo" } }),
    );

    expect(result.current.state.value).toBe("foo");

    act(() => {
      result.current.state.setValue("bar");
    });
    expect(result.current.state.value).toBe("bar");
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useRadioGroupState("id", { initialState: { disabled: true } }),
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
