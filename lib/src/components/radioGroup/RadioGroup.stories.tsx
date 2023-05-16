import { Meta, StoryFn } from "@storybook/react";

import { useComponentState } from "state";

import { RadioGroup } from "./RadioGroup";

export default {
  title: "RadioGroup",
  component: RadioGroup,
} as Meta<typeof RadioGroup>;

const Template: StoryFn<typeof RadioGroup> = (args) => <RadioGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: ["Apple", "Orange", "Pear"],
  label: "Fruits",
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  ...Default.args,
  defaultValue: "Orange",
};

export const ObjectData = () => {
  const id = "radioGroup1";
  const t = useComponentState(id);
  return (
    <>
      <RadioGroup
        id={id}
        data={[
          { label: "Apple", value: "apple" },
          { label: "Orange", value: "orange" },
          { label: "Pear", value: "pear" },
        ]}
        label="Fruits"
      />
      <div>Value: {t?.value}</div>
    </>
  );
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  loading: true,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
};

export const Vertical = Template.bind({});
Vertical.args = {
  data: ["Apple", "Orange", "Pear"],
  label: "Fruits",
  orientation: "vertical",
};

export const RadioGroupError = Template.bind({});
RadioGroupError.args = {
  ...Default.args,
  error: "ERROR",
};
