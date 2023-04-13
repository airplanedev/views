import { StoryFn, Meta } from "@storybook/react";

import { Label } from "./Text";
import { LabelProps } from "./Text.types";

export default {
  title: "Label",
  component: Label,
} as Meta<typeof Label>;

const Template: StoryFn<typeof Label> = (args: LabelProps) => (
  <Label {...args} />
);

export const Simple = Template.bind({});
Simple.args = {
  children: "Hello, world! This is some cool text for all you cool cats.",
};

export const FontWeights = () => (
  <>
    <Label weight="light">Light</Label>
    <Label weight="normal">Regular</Label>
    <Label weight="medium">Medium</Label>
    <Label weight="semibold">Semibold</Label>
    <Label weight="bold">Bold</Label>
  </>
);
