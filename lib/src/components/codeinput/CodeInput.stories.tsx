import { Meta, StoryFn } from "@storybook/react";

import { Button } from "components/button/Button";
import { Checkbox } from "components/checkbox/Checkbox";
import { Select } from "components/select/Select";
import { Stack } from "components/stack/Stack";
import { useComponentState } from "state";

import { CodeInput } from "./CodeInput";
import { CodeInputProps } from "./CodeInput.types";

export default {
  title: "Code Input",
  component: CodeInput,
} as Meta<typeof CodeInput>;

const Template: StoryFn<typeof CodeInput> = (args: CodeInputProps) => (
  <CodeInput {...args} />
);

export const Default = () => {
  const inputState = useComponentState("select");
  const lineNumbersState = useComponentState("lineNumbers");
  const foldGutterState = useComponentState("foldGutter");
  return (
    <>
      <CodeInput
        label="Label"
        placeholder="Placeholder"
        description="Description"
        lineNumbers={lineNumbersState.value}
        foldGutter={foldGutterState.value}
        required
        language={inputState.value}
      />
      <Select
        id="select"
        label="Language"
        defaultValue="javascript"
        data={["sql", "javascript", "json", "yaml"]}
      />
      <Stack direction="row">
        <Checkbox id="lineNumbers" label="Line numbers?" defaultChecked />
        <Checkbox id="foldGutter" label="Fold gutter?" />
      </Stack>
    </>
  );
};

export const DarkMode = () => {
  const inputState = useComponentState("select");
  const lineNumbersState = useComponentState("lineNumbers");
  const foldGutterState = useComponentState("foldGutter");
  return (
    <>
      <CodeInput
        label="Label"
        placeholder="Placeholder"
        description="Description"
        lineNumbers={lineNumbersState.value}
        foldGutter={foldGutterState.value}
        theme="dark"
        language={inputState.value}
      />
      <Select
        id="select"
        label="Language"
        defaultValue="javascript"
        data={["sql", "javascript", "json", "yaml"]}
      />
      <Stack direction="row">
        <Checkbox id="lineNumbers" label="Line numbers?" defaultChecked />
        <Checkbox id="foldGutter" label="Fold gutter?" />
      </Stack>
    </>
  );
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
  const inputState = useComponentState("myCodeInput");
  return (
    <>
      <Button
        onClick={() => {
          inputState.setValue(inputState.value! + "a");
          inputState.focus();
        }}
      >
        Append
      </Button>
      <CodeInput id="myCodeInput" defaultValue="a" />
    </>
  );
};
