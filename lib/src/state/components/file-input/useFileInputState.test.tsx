import { TextEncoder } from "util";
global.TextEncoder = TextEncoder;

import { AirplaneFile } from "airplane";

import { act, renderHook } from "test-utils/react";

import { useFileInputState } from "./useFileInputState";
describe("useFileInputState", () => {
  const d = new AirplaneFile(new Blob(["foo"]), {
    id: "",
    url: "",
    name: "foo.txt",
  });
  it("sets value", () => {
    const { result } = renderHook(() =>
      useFileInputState("id", { initialState: {} }),
    );

    expect(result.current.state.value).toStrictEqual(undefined);

    act(() => {
      result.current.state.setValue([d]);
    });
    expect(result.current.state.value).toStrictEqual([d]);
  });

  it("sets disabled", () => {
    const { result } = renderHook(() =>
      useFileInputState("id", { initialState: { disabled: true } }),
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
