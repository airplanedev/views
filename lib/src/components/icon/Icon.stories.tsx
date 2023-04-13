import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";

import {
  AcademicCapIcon,
  AcademicCapIconOutline,
  AcademicCapIconMini,
} from "./";
import { Icon } from "./Icon";
import { Props } from "./Icon.types";

export default {
  title: "Icon",
  component: Icon,
  argTypes: {
    color: { type: "string" },
    size: { type: "string" },
  },
  args: {
    children: <AcademicCapIcon />,
  },
} as Meta<typeof Icon>;

const Template: StoryFn<Props> = ({ children, ...args }) => {
  const c = children as React.ReactElement;
  return <Icon {...args}>{c}</Icon>;
};

export const Default = Template.bind({});
Default.args = {};

export const Outline = Template.bind({});
Outline.args = {
  children: <AcademicCapIconOutline />,
  color: "primary",
};

export const Mini = Template.bind({});
Mini.args = {
  children: <AcademicCapIconMini />,
};
