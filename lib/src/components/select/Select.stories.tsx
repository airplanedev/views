import { Meta, StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useState } from "react";

import { Callout } from "components/callout/Callout";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { SelectState, useComponentState } from "state";
import { SelectTValue } from "state/components/select/reducer";

import { Select } from "./Select";

export default {
  title: "Select",
  component: Select,
  decorators: [
    (Story) => (
      <Stack height="96u">
        <Story />
      </Stack>
    ),
  ],
} as Meta<typeof Select>;

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />;

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

export const ObjectData = Template.bind({});
ObjectData.args = {
  data: [
    { label: "Apple", value: "apple" },
    { label: "Orange", value: "orange" },
    { label: "Pear", value: "pear" },
  ],
  label: "Fruits",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Unsearchable = Template.bind({});
Unsearchable.args = {
  ...Default.args,
  searchable: false,
};

export const Clearable = Template.bind({});
Clearable.args = {
  ...Default.args,
  clearable: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  loading: true,
};

export const Numbers = Template.bind({});
Numbers.args = {
  data: [1, 2, 3],
  label: "Numbers",
};

export const NumbersData = () => {
  const state = useComponentState<SelectState>("selectid");
  const [value, setValue] = useState<SelectTValue>(undefined);
  return (
    <>
      <Text>{state.value}</Text>
      <Text>{value}</Text>
      <Select
        id="selectid"
        data={[
          { label: "First number", value: 1 },
          { label: "Second number", value: 2 },
          { label: "Third number", value: 3 },
        ]}
        onChange={(v) => {
          setValue(v);
        }}
        label="Numbers"
        clearable
      />
    </>
  );
};

export const ItemComponent = Template.bind({});
ItemComponent.args = {
  ...Default.args,
  ItemComponent: ({ label }) => <Callout>{label}</Callout>,
};
ItemComponent.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByLabelText("Fruits"));
};
ItemComponent.parameters = {
  chromatic: { diffThreshold: 0.83 },
};

export const ItemComponentDeprecated = Template.bind({});
ItemComponentDeprecated.args = {
  ...Default.args,
  itemComponent: ({ label }) => <Callout>{label}</Callout>,
};
