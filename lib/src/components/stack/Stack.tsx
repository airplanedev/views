import { Box, createStyles } from "@mantine/core";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";

import { alignToAlignItems, justifyToJustifyContent } from "./flexHelpers";
import { StackProps } from "./Stack.types";

type StyleParams = Pick<
  Required<StackProps>,
  "direction" | "justify" | "align" | "spacing" | "wrap" | "scroll"
>;

const useStyles = createStyles(
  (
    theme,
    { direction, justify, align, spacing, wrap, scroll }: StyleParams,
  ) => {
    const justifyContent = justifyToJustifyContent[justify];
    const alignItems = alignToAlignItems[align];
    return {
      root: {
        display: "flex",
        flexDirection: direction,
        justifyContent,
        alignItems,
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: typeof spacing === "number" ? spacing : theme.spacing[spacing],
        overflow: scroll ? "auto" : undefined,
      },
    };
  },
);

export const StackComponent = ({
  children,
  direction = "column",
  justify = "start",
  align = "stretch",
  spacing = "md",
  wrap = false,
  scroll = false,
  sx,
  className,
  style,
  width,
  height,
  grow,
}: StackProps) => {
  const { classes, cx } = useStyles({
    direction,
    justify,
    align,
    spacing,
    wrap,
    scroll,
  });
  const { classes: layoutClasses } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  return (
    <Box
      style={style}
      className={cx(classes.root, layoutClasses.style, className)}
      sx={sx}
    >
      {children}
    </Box>
  );
};

export const Stack = (props: StackProps) => (
  <ComponentErrorBoundary componentName={Stack.displayName}>
    <StackComponent {...props} />
  </ComponentErrorBoundary>
);

Stack.displayName = "Stack";
