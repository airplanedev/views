import { Meta, StoryFn } from "@storybook/react";

import { Button } from "components/button/Button";

import { Tooltip } from "./Tooltip";
import { Props } from "./Tooltip.types";

export default {
  title: "Tooltip",
  component: Tooltip,
  args: {
    children: <Button>Did you hear about the claustrophobic astronaut?</Button>,
    label: "He just needed a little space",
  },
} as Meta<typeof Tooltip>;

const Template: StoryFn<Props> = ({ children, ...restProps }) => (
  <div style={{ padding: 120 }}>
    <Tooltip {...restProps}>{children}</Tooltip>
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const BottomPosition = Template.bind({});
BottomPosition.args = {
  position: "bottom",
};

export const MultiLine = Template.bind({});
MultiLine.args = {
  multiline: true,
  label: "He only just needed a tad bit of space around him",
  width: 100,
  color: "success",
};

export const WithString = Template.bind({});
WithString.args = {
  children: "Did you hear about the claustrophobic astronaut?",
};

export const WithFragment = Template.bind({});
WithFragment.args = {
  children: <>Did you hear about the claustrophobic astronaut?</>,
};

const CustomC = () => <div>I am a custom component with no forwardRef</div>;
export const WithWrapper = Template.bind({});
WithWrapper.args = {
  children: <CustomC />,
  wrapper: "div",
  label: "And I am a mighty tooltip with a wrapper",
};
