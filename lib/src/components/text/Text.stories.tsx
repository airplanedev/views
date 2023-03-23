import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Text } from "./Text";

export default {
  title: "Text",
  component: Text,
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => <Text {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  children: "Hello, world! This is some cool text for all you cool cats.",
};

export const Markdown = Template.bind({});
Markdown.args = {
  children: `
# Hello world

Hello World!

This is another line of text.

## Header 2

### Header 3

* Test1
* Test2

\`\`\`c++
#include <cstdio>
int main() {
  printf("Hello World!");
}
\`\`\`
`,
};

export const MarkdownWithColor = Template.bind({});
MarkdownWithColor.args = {
  color: "blue",
  children: `
# Hello world

Hello World!

## Header 2

### Header 3

* Test1
* Test2

\`\`\`c++
#include <cstdio>
int main() {
  printf("Hello World!");
}
\`\`\`
`,
};

export const MarkdownDisabled = Template.bind({});
MarkdownDisabled.args = {
  children: `
# Hello world

Hello World!

## Header 2

### Header 3

* Test1
* Test2

\`\`\`c++
#include <cstdio>
int main() {
  printf("Hello World!");
}
\`\`\`
`,
  disableMarkdown: true,
};

export const NonString = Template.bind({});
NonString.args = {
  children: <div># Hello World!</div>,
};

export const FontWeights = () => (
  <>
    <Text weight="light">Light</Text>
    <Text weight="normal">Regular</Text>
    <Text weight="medium">Medium</Text>
    <Text weight="semibold">SemiBold</Text>
    <Text weight="bold">Bold</Text>
  </>
);
export const Sizes = () => (
  <>
    <Text size="xs">xs</Text>
    <Text size="sm">sm</Text>
    <Text size="md">md</Text>
    <Text size="lg">lg</Text>
    <Text size="xl">xl</Text>
  </>
);
