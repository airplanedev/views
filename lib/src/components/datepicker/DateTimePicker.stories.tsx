import { Meta, StoryFn } from "@storybook/react";

import { DateTimePickerProps } from "./DatePicker.types";
import { DateTimePicker } from "./DateTimePicker";

export default {
  title: "DateTimePicker",
  component: DateTimePicker,
} as Meta<typeof DateTimePicker>;

const Template: StoryFn<DateTimePickerProps> = (args: DateTimePickerProps) => (
  <DateTimePicker {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  description: "Description",
  placeholder: "Placeholder",
  clearable: true,
};
