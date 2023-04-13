import { Button } from "@mantine/core";
import { StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { AcademicCapIcon } from "components/icon";

import { Props } from "./Notification.types";
import { showNotification } from "./showNotification";

export default {
  title: "Notification",
  args: {
    message: "Message",
  },
  parameters: {
    chromatic: { delay: 500 },
  },
};

const Template: StoryFn<Props> = (args: Props) => (
  <Button onClick={() => showNotification(args)}>Show notification</Button>
);

export const Default = Template.bind({});
Default.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByText("Show notification"));
};

export const DefaultWithTitle = Template.bind({});
DefaultWithTitle.args = {
  title: "Title",
};
DefaultWithTitle.play = async ({ args, canvasElement }) => {
  const body = canvasElement.ownerDocument.body;
  await userEvent.click(await within(body).findByText("Show notification"));
  await within(body).findByText("Message");
};

export const DefaultWithTitleAndIcon = Template.bind({});
DefaultWithTitleAndIcon.args = {
  title: "Title",
  icon: <AcademicCapIcon />,
};
DefaultWithTitleAndIcon.play = async ({ args, canvasElement }) => {
  const body = canvasElement.ownerDocument.body;
  await userEvent.click(await within(body).findByText("Show notification"));
  await within(body).findByText("Message");
};

export const Success = Template.bind({});
Success.args = {
  type: "success",
};
Success.play = async ({ args, canvasElement }) => {
  const body = canvasElement.ownerDocument.body;
  await userEvent.click(await within(body).findByText("Show notification"));
  await within(body).findByText("Message");
};

export const Error = Template.bind({});
Error.args = {
  type: "error",
};
Error.play = async ({ args, canvasElement }) => {
  const body = canvasElement.ownerDocument.body;
  await userEvent.click(await within(body).findByText("Show notification"));
  await within(body).findByText("Message");
};
