import objectInspect from "object-inspect";

import {
  sanitizeMessage,
  FUNCTION_PREFIX,
  ELEMENT_PREFIX,
} from "./sanitizeMessage";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FUNCTION = () => {};

describe("sanitizeMessage", () => {
  it("should serialize to same object if it doesn't contain functions or dom nodes", () => {
    const obj = { a: "string", b: 5 };
    expect(sanitizeMessage(obj)).toStrictEqual(obj);
  });

  it("should replace functions with string with prefix", () => {
    const obj = EMPTY_FUNCTION;
    expect(sanitizeMessage(obj)).toStrictEqual(
      FUNCTION_PREFIX + objectInspect(EMPTY_FUNCTION),
    );
  });

  it("should replace elements with string with prefix", () => {
    const obj = document.createElement("div");
    expect(sanitizeMessage(obj)).toStrictEqual(
      ELEMENT_PREFIX + objectInspect(obj),
    );
  });

  it("should replace nested functions", () => {
    const obj = { oneLayer: { anotherLayer: [5, EMPTY_FUNCTION] } };
    expect(sanitizeMessage(obj)).toStrictEqual({
      oneLayer: {
        anotherLayer: [5, FUNCTION_PREFIX + objectInspect(EMPTY_FUNCTION)],
      },
    });
  });
});
