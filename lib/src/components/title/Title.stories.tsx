import { StoryFn, Meta } from "@storybook/react";

import { Title, TitleProps } from "./Title";

export default {
  title: "Title",
  component: Title,
} as Meta<typeof Title>;

const Template: StoryFn<typeof Title> = (args: TitleProps) => (
  <Title {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: "Reasons why cats are better than dogs",
};

export const Order = () => {
  const orders = [1, 2, 3, 4, 5, 6] as const;
  return (
    <>
      {orders.map((order) => (
        <Title order={order} key={order}>
          Title {order}
        </Title>
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
