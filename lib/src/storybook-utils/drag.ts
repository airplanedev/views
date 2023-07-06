import { fireEvent } from "@storybook/testing-library";

// https://stackoverflow.com/a/53946549/1179377
function isElement(obj: HTMLElement | Coords): obj is HTMLElement {
  let prototypeStr, prototype;
  do {
    prototype = Object.getPrototypeOf(obj);
    // to work in iframe
    prototypeStr = Object.prototype.toString.call(prototype);
    // '[object Document]' is used to detect document
    if (
      prototypeStr === "[object Element]" ||
      prototypeStr === "[object Document]"
    ) {
      return true;
    }
    obj = prototype;
    // null is the terminal of object
  } while (prototype !== null);
  return false;
}

function getElementClientCenter(element: HTMLElement) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

const getCoords = (charlie: HTMLElement | Coords) =>
  isElement(charlie) ? getElementClientCenter(charlie) : charlie;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type Coords = {
  x: number;
  y: number;
};

type DragProps = {
  to?: HTMLElement | Coords;
  delta?: Coords;
  steps?: number;
  duration?: number;
};

export async function drag(
  element: HTMLElement,
  { to: inTo, delta, steps = 20, duration = 500 }: DragProps,
) {
  const from = getElementClientCenter(element);
  const to = delta
    ? {
        x: from.x + delta.x,
        y: from.y + delta.y,
      }
    : inTo
    ? getCoords(inTo)
    : from;

  const step = {
    x: (to.x - from.x) / steps,
    y: (to.y - from.y) / steps,
  };

  const current = {
    clientX: from.x,
    clientY: from.y,
  };

  fireEvent.mouseEnter(element, current);
  fireEvent.mouseOver(element, current);
  fireEvent.mouseMove(element, current);
  fireEvent.mouseDown(element, current);
  for (let i = 0; i < steps; i++) {
    current.clientX += step.x;
    current.clientY += step.y;
    await sleep(duration / steps);
    fireEvent.mouseMove(element, current);
  }
  fireEvent.mouseUp(element, current);
}
