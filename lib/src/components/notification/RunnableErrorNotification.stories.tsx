import { Button } from "@mantine/core";
import { StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { ExecuteError } from "components/query";

import {
  showRunnableErrorNotification,
  RunnableErrorNotificationProps as Props,
} from "./showRunnableErrorNotification";

const ExampleRunError: ExecuteError = {
  message:
    "Run failed: ErrBadRequest: dial tcp: lookup host.docker.internal: no such host",
  type: "FAILED",
};

const ExampleSessionError: ExecuteError = {
  message: "Session failed",
  type: "FAILED",
};

export default {
  title: "Runnable Error Notification",
  parameters: {
    chromatic: { delay: 500 },
  },
};

const Template: StoryFn<Props> = (args: Props) => (
  <Button onClick={() => showRunnableErrorNotification(args)}>
    Show notification
  </Button>
);

export const Task = Template.bind({});
Task.args = {
  error: ExampleRunError,
  runID: "runXYZ",
};
Task.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByText("Show notification"));
};

export const Session = Template.bind({});
Session.args = {
  error: ExampleSessionError,
  sessionID: "sessionXYZ",
};
Session.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByText("Show notification"));
};

export const WithSlug = Template.bind({});
WithSlug.args = {
  error: ExampleRunError,
  runID: "runXYZ",
  slug: "my_task",
};
WithSlug.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByText("Show notification"));
};
