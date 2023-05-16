import { Meta, StoryFn } from "@storybook/react";

import { Loader } from "./Loader";
import { LoaderProps } from "./Loader.types";

export default {
  title: "Loader",
  component: Loader,
} as Meta<typeof Loader>;

const Template: StoryFn<LoaderProps> = (args: LoaderProps) => (
  <Loader {...args} />
);

export const Oval = Template.bind({});
Oval.args = {
  color: "primary",
  size: "md",
  variant: "oval",
};

export const Bar = Template.bind({});
Bar.args = {
  ...Oval.args,
  variant: "bars",
};

export const Dots = Template.bind({});
Dots.args = {
  ...Oval.args,
  variant: "dots",
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  color: "primary",
  variant: "oval",
  size: "xs",
};

export const Small = Template.bind({});
Small.args = {
  ...ExtraSmall.args,
  size: "sm",
};

export const Medium = Template.bind({});
Medium.args = {
  ...ExtraSmall.args,
  size: "md",
};

export const Large = Template.bind({});
Large.args = {
  ...ExtraSmall.args,
  size: "lg",
};

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
  ...ExtraSmall.args,
  size: "xl",
};
