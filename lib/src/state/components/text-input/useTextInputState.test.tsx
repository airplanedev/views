import { act, renderHook } from "test-utils/react";

import { useTextInputState } from "./useTextInputState";

describe("useTextInputState", () => {
  it("sets value", () => {
    const { result } = renderHook(() =>
      useTextInputState("id", { initialState: { value: "foo" } }),
    );

    expect(result.current.state.value).toBe("foo");

    act(() => {
      result.current.state.setValue("bar");
    });
    expect(result.current.state.value).toBe("bar");
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useTextInputState("id", { initialState: { disabled: true } }),
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

  it("focuses", () => {
    const focus = jest.fn();
    const { result } = renderHook(() => useTextInputState("id", { focus }));

    act(() => {
      result.current.state.focus();
    });
    expect(focus.mock.calls.length).toBe(1);
  });
});
