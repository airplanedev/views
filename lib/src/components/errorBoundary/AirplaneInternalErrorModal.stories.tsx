import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";

import { AirplaneInternalErrorModal } from "./ComponentAirplaneInternalErrorFallback";

export default {
  title: "AirplaneInternalErrorModal",
  component: AirplaneInternalErrorModal,
} as Meta<typeof AirplaneInternalErrorModal>;

const Template: StoryFn<typeof AirplaneInternalErrorModal> = (args) => {
  const [opened, setOpened] = useState(true);
  return (
    <AirplaneInternalErrorModal
      {...args}
      opened={opened}
      setOpened={setOpened}
    />
  );
};

export const Simple = Template.bind({});
Simple.args = {
  errorMessage: "Example error message",
  componentName: "Table",
};
