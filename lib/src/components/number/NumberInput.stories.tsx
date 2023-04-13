import { Meta, StoryFn } from "@storybook/react";
import { useRef } from "react";

import { Button } from "components/button/Button";
import { Divider } from "components/divider/Divider";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { NumberInputState, useComponentState } from "state";

import { NumberInput } from "./NumberInput";

export default {
  title: "Number Input",
  component: NumberInput,
} as Meta<typeof NumberInput>;

const Template: StoryFn<typeof NumberInput> = (args) => (
  <NumberInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  description: "Description",
};

export const WithError = Template.bind({});
WithError.args = {
  label: "Your age",
  error: "You must be at least 21",
  defaultValue: 20,
};

export const Disabled = Template.bind({});
Disabled.args = {
  defaultDisabled: true,
};

export const Percent = Template.bind({});
Percent.args = {
  format: "percent",
  step: 0.005,
  precision: 4,
};

export const Dollars = Template.bind({});
Dollars.args = {
  format: "currency",
  precision: 2,
};

export const Euros = Template.bind({});
Euros.args = {
  format: "currency",
  precision: 2,
  currency: "EUR",
};

export const DecrementAndIncrement = () => {
  const inputState = useComponentState<NumberInputState>("myNumberInput");
  const inputState2 = useComponentState<NumberInputState>("myNumberInput2");

  return (
    <Stack>
      <Stack direction="row">
        <Button onClick={() => inputState.setValue(inputState.value! - 1)}>
          -1
        </Button>
        <Button onClick={() => inputState.setValue(inputState.value! + 1)}>
          +1
        </Button>
      </Stack>
      <NumberInput
        id="myNumberInput"
        defaultValue={5}
        max={10}
        min={2}
        label="Min: 2, Max: 10"
      />
      <Text>Component state: {inputState.value}</Text>
      <Divider />
      <Stack direction="row">
        <Button onClick={() => inputState2.setValue(inputState2.value! - 1)}>
          -1
        </Button>
        <Button onClick={() => inputState2.setValue(inputState2.value! + 1)}>
          +1
        </Button>
      </Stack>
      <NumberInput
        id="myNumberInput2"
        defaultValue={5}
        label="No min and max"
      />
      <Text>Component state: {inputState2.value}</Text>
    </Stack>
  );
};

export const WithComponentError = () => {
  const ref = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  return (
    <div data-chromatic="ignore">
      {/* Erroring input */}
      <NumberInput id="errorInput" ref={ref}>
        illegal children
      </NumberInput>
      {/* Working input */}
      <NumberInput id="workingInput" ref={ref2} />
      <Button
        onClick={() => {
          ref2.current?.focus();
        }}
      >
        click me to focus on text input
      </Button>
    </div>
  );
};
