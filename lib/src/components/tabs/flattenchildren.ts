// Copied from https://github.com/grrowl/react-keyed-flatten-children. This package has issues
// with being imported from esm.
import {
  ReactNode,
  ReactChild,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { isFragment } from "react-is";

export default function flattenChildren(
  children: ReactNode,
  depth = 0,
  keys: (string | number)[] = [],
): ReactChild[] {
  return Children.toArray(children).reduce(
    (acc: ReactChild[], node, nodeIndex) => {
      if (isFragment(node)) {
        // eslint-disable-next-line prefer-spread
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            depth + 1,
            keys.concat(node.key || nodeIndex),
          ),
        );
      } else {
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              key: keys.concat(String(node.key)).join("."),
            }),
          );
        } else if (typeof node === "string" || typeof node === "number") {
          acc.push(node);
        }
      }
      return acc;
    },
    [],
  );
}
