import { Meta, StoryFn } from "@storybook/react";

import { Heading } from "components/heading/Heading";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";

import { Confirmation } from "./Confirmation";
import { ConfirmationProps } from "./Dialog.types";

export default {
  title: "Confirmation Dialog",
  component: Confirmation,
  args: {
    children: (
      <Stack>
        <Heading level={3}>Confirmation content</Heading>
        <Text>Are you sure you want to do something?</Text>
      </Stack>
    ),
    opened: true,
  },
  argTypes: {
    onClose: { action: "close" },
    onConfirm: { action: "confirm" },
  },
} as Meta<typeof Confirmation>;

const Template: StoryFn<ConfirmationProps> = (args: any) => (
  <Confirmation {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: "Confirmation title",
};

export const CustomText = Template.bind({});
CustomText.args = {
  title: "Confirmation title",
  cancelText: "No thanks",
  confirmText: "Do it",
};
