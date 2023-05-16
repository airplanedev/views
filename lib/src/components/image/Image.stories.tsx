import { Meta, StoryFn } from "@storybook/react";

import { Image } from "./Image";
import { Props } from "./Image.types";

export default {
  title: "Image",
  component: Image,
  args: {
    src: "https://pilotinstitute.com/wp-content/uploads/2021/02/very-small-light-aircraft.jpg",
  },
} as Meta<typeof Image>;

const Template: StoryFn<Props> = (args: Props) => (
  <div style={{ width: 500 }}>
    <Image {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};

export const WithCaption = Template.bind({});
WithCaption.args = {
  caption: "A pretty airplane",
  radius: "lg",
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  imageHeight: 100,
};
