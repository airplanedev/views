import { ComponentMeta, Story } from "@storybook/react";

import { Checkbox } from "./Checkbox";
import { CheckboxProps } from "./Checkbox.types";

export default {
  title: "Checkbox",
  component: Checkbox,
  args: {
    label: "This is my simple checkbox",
  },
} as ComponentMeta<typeof Checkbox>;

const Template: Story<CheckboxProps> = (props) => <Checkbox {...props} />;

export const Default = Template.bind({});

export const ErrorColor = Template.bind({});
ErrorColor.args = {
  color: "error",
  error: "An error occurred",
};

export const XL = Template.bind({});
XL.args = {
  size: "xl",
  description: "description",
};
