import { createStyles } from "@mantine/core";
import { CSSProperties } from "react";

import { CommonLayoutProps, FractionalSize, SizeToken } from "./layout.types";

const FRACTION_SIZE_TO_STYLE: Record<FractionalSize, `${number}%`> = {
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%",
  "1/12": "8.333333%",
  "2/12": "16.666667%",
  "3/12": "25%",
  "4/12": "33.333333%",
  "5/12": "41.666667%",
  "6/12": "50%",
  "7/12": "58.333333%",
  "8/12": "66.666667%",
  "9/12": "75%",
  "10/12": "83.333333%",
  "11/12": "91.666667%",
};

const SIZE_TOKEN_TO_STYLE: Record<SizeToken, `${number}rem`> = {
  "0.5u": "0.125rem",
  "1u": "0.25rem",
  "1.5u": "0.375rem",
  "2u": "0.5rem",
  "2.5u": "0.625rem",
  "3u": "0.75rem",
  "3.5u": "0.875rem",
  "4u": "1rem",
  "5u": "1.25rem",
  "6u": "1.5rem",
  "7u": "1.75rem",
  "8u": "2rem",
  "9u": "2.25rem",
  "10u": "2.5rem",
  "11u": "2.75rem",
  "12u": "3rem",
  "14u": "3.5rem",
  "16u": "4rem",
  "20u": "5rem",
  "24u": "6rem",
  "28u": "7rem",
  "32u": "8rem",
  "36u": "9rem",
  "40u": "10rem",
  "44u": "11rem",
  "48u": "12rem",
  "52u": "13rem",
  "56u": "14rem",
  "60u": "15rem",
  "64u": "16rem",
  "72u": "18rem",
  "80u": "20rem",
  "96u": "24rem",
  "128u": "32rem",
  "192u": "48rem",
  "256u": "64rem",
};

const SIZE_TO_STYLE: Record<string, string | undefined> = {
  ...FRACTION_SIZE_TO_STYLE,
  ...SIZE_TOKEN_TO_STYLE,
  full: "100%",
  auto: "auto",
};

const getCommonLayoutStyles = (
  props: CommonLayoutProps,
): {
  width: CSSProperties["width"];
  height: CSSProperties["height"];
  flexGrow: number | undefined;
} => {
  const { width, height } = props;
  return {
    width: width && (SIZE_TO_STYLE[width] ?? width),
    height: height && (SIZE_TO_STYLE[height] ?? height),
    flexGrow: props.grow ? 1 : undefined,
  };
};

/**
 * Hook that converts our layout props to CSS styles.
 */
export const useCommonLayoutStyle = createStyles(
  (_, props: CommonLayoutProps) => {
    return {
      style: getCommonLayoutStyles(props),
    };
  },
);
