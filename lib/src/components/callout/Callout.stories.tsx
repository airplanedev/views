import { faker } from "@faker-js/faker";
import { Meta, StoryFn } from "@storybook/react";

import { Text } from "components";
import { PaperAirplaneIcon } from "components/icon";

import { Callout } from "./Callout";

faker.seed(123);

export default {
  title: "Callout",
  component: Callout,
} as Meta<typeof Callout>;

const Template: StoryFn<typeof Callout> = (args) => <Callout {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Hello",
  children: "Hello world",
};

export const Info = Template.bind({});
Info.args = {
  title: "Hello",
  children: "Hello world",
  variant: "info",
};

export const Success = Template.bind({});
Success.args = {
  title: "Hello",
  children: "Hello world",
  variant: "success",
};

export const Warning = Template.bind({});
Warning.args = {
  title: "Hello",
  children: "Hello world",
  variant: "warning",
};

export const Error = Template.bind({});
Error.args = {
  title: "Hello",
  children: "Hello world",
  variant: "error",
};

export const Neutral = Template.bind({});
Neutral.args = {
  title: "Hello",
  children: "Hello world",
  variant: "neutral",
};

export const NeutralWithIcon = Template.bind({});
NeutralWithIcon.args = {
  title: "Hello",
  children: "Hello world",
  variant: "neutral",
  icon: <PaperAirplaneIcon />,
};

export const LongText = Template.bind({});
LongText.args = {
  title: "Hello",
  children: <Text>{faker.lorem.paragraphs(10, "\n\n")}</Text>,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  title: "Hello",
  children: "Hello world",
  icon: <PaperAirplaneIcon />,
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  children: "Hello world",
};

export const NoChildren = Template.bind({});
NoChildren.args = {
  title: "Hello",
};

export const HideIcon = Template.bind({});
HideIcon.args = {
  title: "Hello",
  children: "Hello world",
  icon: null,
};

export const Empty = Template.bind({});
Empty.args = {
  icon: null,
};
