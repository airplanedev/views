import { Text as MantineText } from "@mantine/core";
import { forwardRef, Ref } from "react";
import ReactMarkdown from "react-markdown";

import { Code } from "components/code/Code";
import { Props as CodeProps } from "components/code/Code.types";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { Heading } from "components/heading/Heading";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";

import {
  useParagraphStyles,
  useRawTextStyles,
  useTextWeight,
} from "./Text.styles";
import { LabelProps, TextProps } from "./Text.types";
import { fontWeight } from "../theme/typography";

/**
 * Text component.
 *
 * Renders text but also supports Markdown.
 */
export const Text = forwardRef<HTMLDivElement, TextProps>((props, ref) => (
  <ComponentErrorBoundary componentName={DISPLAY_NAME}>
    <TextWithoutRef {...props} innerRef={ref} />
  </ComponentErrorBoundary>
));
const DISPLAY_NAME = "Text";
Text.displayName = DISPLAY_NAME;

type TextWithoutRefProps = TextProps & { innerRef: Ref<HTMLDivElement> };
/**
 * Text component without ref forwarding.
 *
 * This component is exported for documentation purposes. It should not be used.
 * */
export const TextWithoutRef = ({
  disableMarkdown,
  children,
  size = "md",
  innerRef,
  ...props
}: TextWithoutRefProps) => {
  const { classes } = useParagraphStyles({ size });
  const rawTextProps = {
    size,
    className: classes.paragraph,
    ...props,
  };
  if (disableMarkdown || typeof children !== "string") {
    return (
      // Note that we only apply the ref to a label because the ref crashes
      // when used with markdown.
      <Label {...rawTextProps} ref={innerRef}>
        {children}
      </Label>
    );
  }
  const markdownHeadingProps = {
    color: props.color,
    weight: props.weight,
    transform: props.transform,
    align: props.align,
    italic: props.italic,
    underline: props.underline,
    strikethrough: props.strikethrough,
    sx: props.sx,
    className: props.className,
    style: props.style,
    width: props.width,
  };
  return (
    <ReactMarkdown
      components={{
        h1: (componentProps) => (
          <Heading {...markdownHeadingProps} level={1}>
            {componentProps.children}
          </Heading>
        ),
        h2: (componentProps) => (
          <Heading {...markdownHeadingProps} level={2}>
            {componentProps.children}
          </Heading>
        ),
        h3: (componentProps) => (
          <Heading {...markdownHeadingProps} level={3}>
            {componentProps.children}
          </Heading>
        ),
        h4: (componentProps) => (
          <Heading {...markdownHeadingProps} level={4}>
            {componentProps.children}
          </Heading>
        ),
        h5: (componentProps) => (
          <Heading {...markdownHeadingProps} level={5}>
            {componentProps.children}
          </Heading>
        ),
        h6: (componentProps) => (
          <Heading {...markdownHeadingProps} level={6}>
            {componentProps.children}
          </Heading>
        ),
        p: (componentProps) => (
          <Label {...rawTextProps}>{componentProps.children}</Label>
        ),
        ul: (componentProps) => (
          <ul>
            <Label {...rawTextProps}>{componentProps.children}</Label>
          </ul>
        ),
        ol: (componentProps) => (
          <ol>
            <Label {...rawTextProps}>{componentProps.children}</Label>
          </ol>
        ),
        li: (componentProps) => (
          <li>
            <Label {...rawTextProps}>{componentProps.children}</Label>
          </li>
        ),
        code({ node, inline, className, children, ...componentProps }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <Code
              language={match[1] as CodeProps["language"]}
              {...componentProps}
            >
              {String(children)}
            </Code>
          ) : (
            <code className={className} {...componentProps}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

/** Text without automatic formatting like Markdown and paragraph-like margins **/
export const Label = forwardRef<HTMLDivElement, LabelProps>((props, ref) => (
  <LabelWithoutRef {...props} innerRef={ref} />
));
Label.displayName = "Label";

type LabelWithoutRefProps = LabelProps & { innerRef: Ref<HTMLDivElement> };
/**
 * Label component without ref forwarding.
 *
 * This component is exported for documentation purposes. It should not be used.
 */
export const LabelWithoutRef = ({
  className,
  style,
  size = "md",
  innerRef,
  children,
  color = "gray.7",
  weight,
  width,
  height,
  grow,
  ...props
}: LabelWithoutRefProps) => {
  const textWeight = useTextWeight(size);
  const { classes, cx } = useRawTextStyles({ size });
  const { classes: layoutClasses } = useCommonLayoutStyle({
    width,
    height,
    grow,
  });
  return (
    <MantineText
      className={cx(classes.root, layoutClasses.style, className)}
      style={style}
      color={color}
      weight={weight ? fontWeight[weight] : textWeight}
      ref={innerRef}
      {...props}
    >
      {children}
    </MantineText>
  );
};
