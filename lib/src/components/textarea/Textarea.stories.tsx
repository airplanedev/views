import { Meta, StoryFn } from "@storybook/react";

import { Textarea } from "./Textarea";
import { TextareaProps } from "./Textarea.types";

export default {
  title: "Text Area",
  component: Textarea,
} as Meta<typeof Textarea>;

const Template: StoryFn<typeof Textarea> = (args: TextareaProps) => (
  <Textarea {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  placeholder: "Placeholder",
  description: "Description",
  minRows: 5,
};

export const WithError = Template.bind({});
WithError.args = {
  error: "Error!!!",
  defaultValue: "My bad value",
};

export const Disabled = Template.bind({});
Disabled.args = {
  defaultDisabled: true,
};

export const Autosize = Template.bind({});
Autosize.args = {
  autosize: true,
  maxRows: 3,
  placeholder: "multi-\nline\nstring",
};
