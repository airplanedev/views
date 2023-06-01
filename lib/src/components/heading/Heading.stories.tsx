import { StoryFn, Meta } from "@storybook/react";

import { Heading, HeadingProps } from "./Heading";

export default {
  title: "Heading",
  component: Heading,
} as Meta<typeof Heading>;

const Template: StoryFn<typeof Heading> = (args: HeadingProps) => (
  <Heading {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Reasons why cats are better than dogs",
};

export const Level = () => {
  const levels = [1, 2, 3, 4, 5, 6] as const;
  return (
    <>
      {levels.map((level) => (
        <Heading level={level} key={level}>
          Reasons why cats are better than dogs (level {level})
        </Heading>
      ))}
    </>
  );
};

export const Italic = Template.bind({});
Italic.args = {
  ...Default.args,
  italic: true,
};

export const Underline = Template.bind({});
Underline.args = {
  ...Default.args,
  underline: true,
};

export const Strikethrough = Template.bind({});
Strikethrough.args = {
  ...Default.args,
  strikethrough: true,
};

export const Color = Template.bind({});
Color.args = {
  ...Default.args,
  color: "blue",
};

export const Weights = () => {
  return (
    <>
      <Heading weight="light">Light</Heading>
      <Heading weight="normal">Regular</Heading>
      <Heading weight="medium">Medium</Heading>
      <Heading weight="semibold">Semibold</Heading>
      <Heading weight="bold">Bold</Heading>
    </>
  );
};
