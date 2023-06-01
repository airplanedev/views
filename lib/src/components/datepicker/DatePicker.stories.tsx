import { Meta, StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { DatePicker } from "./DatePicker";
import { DatePickerProps } from "./DatePicker.types";

export default {
  title: "DatePicker",
  component: DatePicker,
  args: {
    label: "Label",
    description: "Description",
    placeholder: "Placeholder",
  },
} as Meta<typeof DatePicker>;

const Template: StoryFn<DatePickerProps> = (args: DatePickerProps) => (
  <DatePicker {...args} />
);

export const Default = Template.bind({});

export const Clearable = Template.bind({});
Clearable.args = {
  defaultValue: new Date(2022, 1, 1),
  clearable: true,
};
Clearable.parameters = {
  // TODO(PDS-2123): Fix flaky story
  chromatic: { disableSnapshot: true },
};
Clearable.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByLabelText("Label"));
};

export const DisabledDates = Template.bind({});
DisabledDates.args = {
  excludeDate: (d) => d.getDay() === 0,
  defaultValue: new Date(2022, 1, 1),
};
DisabledDates.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByLabelText("Label"));
  await canvas.findByText("15");
};
DisabledDates.parameters = {
  // TODO(PDS-2123): Fix flaky story
  chromatic: { disableSnapshot: true },
};
