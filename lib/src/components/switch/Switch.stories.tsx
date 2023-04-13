import { Meta, StoryFn } from "@storybook/react";

import { useComponentState, SwitchState } from "state";

import { Switch } from "./Switch";
import { SwitchProps } from "./Switch.types";

export default {
  title: "Switch",
  component: Switch,
  args: {
    label: "This is my simple switch",
  },
} as Meta<typeof Switch>;

const Template: StoryFn<SwitchProps> = (props) => <Switch {...props} />;

export const Default = Template.bind({});

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  defaultChecked: true,
};

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

export const InnerLabels = Template.bind({});
InnerLabels.args = { size: "md", offLabel: "OFF", onLabel: "ON" };

export const ObjectData = () => {
  const id = "switch1";
  const t = useComponentState<SwitchState>(id);

  return (
    <>
      <Switch id={id} label="Switch" />
      <div>Checked: {String(t.checked)}</div>
    </>
  );
};
