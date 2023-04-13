import { Meta, StoryFn } from "@storybook/react";

import { Button } from "components/button/Button";
import { Card } from "components/card/Card";
import { Divider } from "components/divider/Divider";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { useComponentState, SliderState } from "state";

import { Slider } from "./Slider";
import { SliderProps } from "./Slider.types";

export default {
  title: "Slider",
  component: Slider,
  args: { label: "my slider" },
} as Meta<typeof Slider>;

const Template: StoryFn<SliderProps> = (props) => (
  <Card width="1/2">
    <Slider {...props} />
  </Card>
);

export const Default = Template.bind({});

export const NoLabel = Template.bind({});
NoLabel.args = {
  label: undefined,
};
export const ErrorColor = Template.bind({});
ErrorColor.args = {
  color: "error",
};

export const CustomMarks = Template.bind({});
CustomMarks.args = {
  min: 10,
  max: 40,
  step: 10,
  marks: [
    { value: 10, label: "XS" },
    { value: 20, label: "S" },
    { value: 30, label: "M" },
    { value: 40, label: "L" },
  ],
};

export const Inverted = Template.bind({});
Inverted.args = {
  inverted: true,
};

export const LG = Template.bind({});
LG.args = {
  size: "lg",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const WithError = Template.bind({});
WithError.args = {
  value: 10,
  error: "Value cannot be under 50",
};

export const ValueLabelDisplayOn = Template.bind({});
ValueLabelDisplayOn.args = {
  valueLabelDisplay: "on",
};

export const ValueLabelDisplayOff = Template.bind({});
ValueLabelDisplayOff.args = {
  valueLabelDisplay: "off",
};

export const ObjectData = () => {
  const s1 = useComponentState<SliderState>("slider1");
  const s2 = useComponentState<SliderState>("slider2");

  return (
    <Card width="1/3">
      <Stack>
        <Slider id="slider1" max={8} label="min: 0, max: 8" />
        <Stack direction="row">
          <Button
            onClick={() => {
              s1.setValue(s1.value! - 2);
            }}
          >
            -2
          </Button>
          <Button
            onClick={() => {
              s1.setValue(s1.value! + 2);
            }}
          >
            +2
          </Button>
        </Stack>
        <Text>Slider component state: {s1.value}</Text>
        <Divider />
        <Slider
          id="slider2"
          label="no min and max set (uses defaults of 0 and 100)"
        />
        <Stack direction="row">
          <Button
            onClick={() => {
              s2.setValue(s2.value! - 27);
            }}
          >
            -27
          </Button>
          <Button
            onClick={() => {
              s2.setValue(s2.value! + 27);
            }}
          >
            +27
          </Button>
        </Stack>
        <Text>Slider component state: {s2.value}</Text>
      </Stack>
    </Card>
  );
};
