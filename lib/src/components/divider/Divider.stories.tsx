import { Meta, StoryFn } from "@storybook/react";

import { Stack } from "components";

import { Divider, DividerProps } from "./Divider";

export default {
  title: "Divider",
  component: Divider,
} as Meta<typeof Divider>;

const Template: StoryFn<DividerProps> = (args: DividerProps) => (
  <Divider {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Sizes = () => {
  return (
    <Stack>
      <Divider size="xs" />
      <Divider size="sm" />
      <Divider size="md" />
      <Divider size="lg" />
    </Stack>
  );
};

export const Colors = () => {
  return (
    <Stack>
      <Divider />
      <Divider color="gray.3" />
      <Divider color="gray.9" />
      <Divider color="teal.1" />
      <Divider color="teal.3" />
      <Divider color="teal" />
      <Divider color="teal.9" />
    </Stack>
  );
};
