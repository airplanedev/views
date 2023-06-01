import { createStyles, CSSObject, Title as MantineTitle } from "@mantine/core";
import React from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { CommonLayoutProps } from "components/layout/layout.types";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { CommonStylingProps } from "components/styling.types";
import { Color } from "components/theme/colors";

type TitleOrder = 1 | 2 | 3 | 4 | 5 | 6;

export type TitleProps = {
  /**
   * Title content
   */
  children: React.ReactNode;
  /**
   * The size and style of the title with 1 being the largest and 6 being the smallest.
   *
   * @default 1
   */
  order?: TitleOrder;
  /**
   * Title color
   */
  color?: Color;
  /** Sets font-weight css property */
  weight?: React.CSSProperties["fontWeight"];
  /** Sets text-transform css property */
  transform?: React.CSSProperties["textTransform"];
  /** Sets text-align css property */
  align?: React.CSSProperties["textAlign"];
  /**
   * Adds font-style: italic
   */
  italic?: boolean;
  /**
   * Underline the title
   */
  underline?: boolean;
  /**
   * Add strikethrough style
   */
  strikethrough?: boolean;
  /**
   * CSS style overrides
   * @deprecated
   */
  sx?: CSSObject;
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
  order: TitleOrder;
};

const useStyles = createStyles((theme, { order }: StyleParams) => ({
  root: {
    ...theme.other.typography.headingPreset[order],
    "&:first-child": {
      marginTop: 0,
    },
  },
}));

export const TitleComponent = ({
  className,
  style,
  order = 1,
  color,
  ...props
}: TitleProps) => {
  const { classes, cx } = useStyles({ order });
  const { classes: layoutClasses } = useCommonLayoutStyle(props);
  return (
    <MantineTitle
      order={order}
      style={style}
      className={cx(classes.root, layoutClasses.style, className)}
      color={color ?? `gray.${titleOrderToGrayShade[order]}`}
      {...props}
    />
  );
};

/**
 * @deprecated - Use Heading instead
 */
export const Title = (props: TitleProps) => (
  <ComponentErrorBoundary componentName={Title.displayName}>
    <TitleComponent {...props} />
  </ComponentErrorBoundary>
);
Title.displayName = "Title";
