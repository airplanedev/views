import { Meta, StoryObj } from "@storybook/react";

import { Button } from "components/button/Button";
import { Heading } from "components/heading/Heading";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";

import { Dialog } from "./Dialog";

const meta = {
  title: "Dialog",
  component: Dialog,
  args: {
    title: "Dialog title",
    children: (
      <Stack>
        <Heading>Dialog content</Heading>
        <Text>I am in a dialog</Text>
        <Button>Button in a dialog</Button>
      </Stack>
    ),
    opened: true,
  },
  argTypes: { onClose: { action: "close" } },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoFocusTrap: Story = {
  args: {
    trapFocus: false,
  },
};
