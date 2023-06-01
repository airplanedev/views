import { createStyles, Title as MantineTitle } from "@mantine/core";
import React from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { CommonLayoutProps } from "components/layout/layout.types";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { CommonStylingProps } from "components/styling.types";
import { Color } from "components/theme/colors";
import { fontWeight, FontWeight } from "components/theme/typography";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  /**
   * Heading content.
   */
  children: React.ReactNode;
  /**
   * The size and style of the Heading with 1 being the largest and 6 being the smallest.
   *
   * @default 1
   */
  level?: HeadingLevel;
  /**
   * Heading color.
   */
  color?: Color;
  /** Controls the font weight. */
  weight?: FontWeight;
  /**
   * Adds italic style.
   */
  italic?: boolean;
  /**
   * Adds underline style.
   */
  underline?: boolean;
  /**
   * Adds strikethrough style.
   */
  strikethrough?: boolean;
} & CommonLayoutProps &
  CommonStylingProps;

const titleOrderToGrayShade = {
  1: 9,
  2: 8,
  3: 8,
  4: 7,
  5: 7,
  6: 7,
};

type StyleParams = {
  level: HeadingLevel;
  weight?: FontWeight;
};

const useStyles = createStyles((theme, { level, weight }: StyleParams) => {
  const headingPreset = {
    ...theme.other.typography.headingPreset[level],
  };
  if (weight) {
    headingPreset.fontWeight = fontWeight[weight];
  }
  return {
    root: {
      ...headingPreset,
      "&:first-child": {
        marginTop: 0,
      },
    },
  };
});

export const HeadingComponent = ({
  children,
  className,
  style,
  level = 1,
  color,
  weight,
  italic,
  underline,
  strikethrough,
  width,
  height,
  grow,
}: HeadingProps) => {
  const { classes, cx } = useStyles({ level, weight });
  const { classes: layoutClasses } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  return (
    <MantineTitle
      order={level}
      style={style}
      className={cx(classes.root, layoutClasses.style, className)}
      color={color ?? `gray.${titleOrderToGrayShade[level]}`}
      italic={italic}
      underline={underline}
      strikethrough={strikethrough}
    >
      {children}
    </MantineTitle>
  );
};

export const Heading = (props: HeadingProps) => (
  <ComponentErrorBoundary componentName={Heading.displayName}>
    <HeadingComponent {...props} />
  </ComponentErrorBoundary>
);
Heading.displayName = "Heading";
