import { Card as MantineCard } from "@mantine/core";
import React, { forwardRef } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";

import { CardProps } from "./Card.types";

export const Card = forwardRef(
  (props: CardProps, ref: React.Ref<HTMLDivElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <CardWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  )
);
const DISPLAY_NAME = "Card";
Card.displayName = DISPLAY_NAME;

export const CardWithoutRef = ({
  children,
  withBorder = true,
  p = "lg",
  radius = "lg",
  className,
  style,
  width,
  height,
  grow,
  ...props
}: CardProps & { innerRef: React.Ref<HTMLDivElement> }) => {
  const { innerRef, ...restProps } = props;
  const { classes: layoutClasses, cx } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  return (
    <MantineCard
      className={cx(layoutClasses.style, className)}
      style={style}
      unstyled
      withBorder={withBorder}
      p={p}
      radius={radius}
      ref={innerRef}
      {...restProps}
    >
      {children}
    </MantineCard>
  );
};
