import { Meta, StoryFn } from "@storybook/react";

import { Button } from "components/button/Button";
import { TextInputState, useComponentState } from "state";

import { TextInput } from "./TextInput";
import { TextInputProps } from "./TextInput.types";

export default {
  title: "Text Input",
  component: TextInput,
} as Meta<typeof TextInput>;

const Template: StoryFn<typeof TextInput> = (args: TextInputProps) => (
  <TextInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  placeholder: "Placeholder",
  description: "Description",
};

export const WithError = Template.bind({});
WithError.args = {
  error: "Error!!!",
  defaultValue: "My bad value",
};

export const Disabled = Template.bind({});
Disabled.args = {
  defaultDisabled: true,
};

export const Append = () => {
  const inputState = useComponentState<TextInputState>("myTextInput");
  return (
    <>
      <Button onClick={() => inputState.setValue(inputState.value! + "a")}>
        Append
      </Button>
      <TextInput id="myTextInput" defaultValue="a" />
    </>
  );
};
