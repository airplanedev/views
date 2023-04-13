import { Meta, StoryFn } from "@storybook/react";

import { ProgressBar } from "./ProgressBar";

export default {
  title: "ProgressBar",
  component: ProgressBar,
} as Meta<typeof ProgressBar>;

const Template: StoryFn<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
);

export const Regular = Template.bind({});
Regular.args = {
  size: "xl",
  value: 40,
  label: "Progress bar",
};

export const Sections = Template.bind({});
Sections.args = {
  sections: [
    {
      value: 25,
      color: "primary",
    },
    {
      value: 25,
      color: "green",
    },
  ],
};
