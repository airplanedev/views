import { Meta, StoryFn } from "@storybook/react";

import { Button } from "components/button/Button";
import { Card } from "components/card/Card";
import { Stack } from "components/stack/Stack";

import { DescriptionList } from "./DescriptionList";
import { DescriptionListProps as Props } from "./DescriptionList.types";

const ITEMS = [
  {
    term: "Beast of Bodmin",
    description: "A large feline inhabiting Bodmin Moor.",
  },
  {
    term: "Morgawr",
    description: "A sea serpent.",
  },
  {
    term: "Owlman",
    description: "A giant owl-like creature.",
  },
];

export default {
  title: "DescriptionList",
  component: DescriptionList,
} as Meta<typeof DescriptionList>;

const Template: StoryFn<Props> = (args: Props) => (
  <div>
    <DescriptionList {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = { items: ITEMS };

export const Loading = Template.bind({});
Loading.args = { items: ITEMS, loading: true };

export const InsideCard = () => {
  return (
    <Card>
      <DescriptionList items={ITEMS} />
    </Card>
  );
};

export const HalfWidth = () => {
  return (
    <Stack direction="row">
      <DescriptionList items={ITEMS} width="1/2" />
    </Stack>
  );
};

export const WithActions = Template.bind({});
WithActions.args = {
  items: [
    {
      term: "Full name",
      description: "Margot Foster",
    },
    {
      term: "Email address",
      description: "margotfoster@example.com",
    },
    {
      term: "Actions",
      description: (
        <div>
          <Button size="xs" sx={{ marginRight: 4 }}>
            See details
          </Button>
          <Button size="xs" variant="outline" preset="danger">
            Dismiss
          </Button>
        </div>
      ),
    },
  ],
};

export const MutliLineCenter = Template.bind({});
MutliLineCenter.args = {
  items: ITEMS.map((i) => ({
    ...i,
    description: i.description.repeat(10),
  })),
  align: "center",
};

export const MutliLineEnd = Template.bind({});
MutliLineEnd.args = {
  items: ITEMS.map((i) => ({
    ...i,
    description: i.description.repeat(10),
  })),
  align: "end",
};
