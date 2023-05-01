import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Avatar } from "./Avatar";

export default {
  title: "Avatar",
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Simple = Template.bind({});
Simple.args = {
  children: "XD",
};

export const Image = Template.bind({});
Image.args = {
  src: "https://lh3.googleusercontent.com/a/ALm5wu2uIJp2e7z8Gpo3TLGH5_nw52rrHbZQdr0VZGNX=s96-c",
};

export const Email = () => {
  return <Avatar email="test@company.com" />;
};
Email.parameters = {
  mockData: [
    {
      url: "http://api/v0/users/get?email=test%40company.com",
      method: "GET",
      status: 200,
      response: {
        user: {
          userID: "usr1",
          name: "Test User",
          avatarURL:
            "https://lh3.googleusercontent.com/a/ALm5wu2uIJp2e7z8Gpo3TLGH5_nw52rrHbZQdr0VZGNX=s96-c",
        },
      },
    },
  ],
};

export const EmailWithoutImage = () => {
  return <Avatar email="test@company.com" />;
};
EmailWithoutImage.parameters = {
  mockData: [
    {
      url: "http://api/v0/users/get?email=test%40company.com",
      method: "GET",
      status: 200,
      response: {
        user: {
          userID: "usr1",
          name: "Zhan Xiong Chin",
        },
      },
    },
  ],
};
