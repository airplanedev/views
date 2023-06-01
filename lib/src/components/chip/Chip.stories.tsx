import { Meta, StoryFn } from "@storybook/react";

import { Stack } from "components";
import { COLORS } from "components/theme/colors";

import { Chip } from "./Chip";

export default {
  title: "Chip",
  component: Chip,
} as Meta<typeof Chip>;

const Template: StoryFn<typeof Chip> = (args) => <Chip {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Hello world",
};

export const Sizes = () => {
  return (
    <Stack direction="row" align="start">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </Stack>
  );
};

export const Variants = () => {
  return (
    <table>
      {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((color) => {
        return (
          <tr key={color}>
            <td>
              <Chip color={color} variant="light">
                {color} light
              </Chip>
            </td>
            <td>
              <Chip color={color} variant="filled">
                {color} filled
              </Chip>
            </td>
            <td>
              <Chip color={color} variant="outline">
                {color} outline
              </Chip>
            </td>
            <td />
          </tr>
        );
      })}
    </table>
  );
};

export const NonStringChild = Template.bind({});
NonStringChild.args = {
  children: (
    <Chip color="lime" size="sm">
      Inception
    </Chip>
  ),
};

export const AutoColor = () => {
  return (
    <Stack direction="row">
      <Chip color="auto">0</Chip>
      <Chip color="auto">1</Chip>
      <Chip color="auto">2</Chip>
      <Chip color="auto">3</Chip>
      <Chip color="auto">Apple</Chip>
      <Chip color="auto">Banana</Chip>
      <Chip color="auto">Strawberry</Chip>
      <Chip color="auto">
        <span>Text wrapped in a span</span>
      </Chip>
    </Stack>
  );
};
