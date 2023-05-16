import { Meta, StoryFn } from "@storybook/react";
import { Fragment, ReactElement } from "react";

import { Card } from "components/card/Card";
import { Table } from "components/table/Table";
import {
  createRandomSimpleUsers,
  SIMPLE_USER_COLUMNS,
} from "components/table/testdata";
import { Text } from "components/text/Text";
import { THEME } from "components/theme/theme";

import { Stack } from "./Stack";
import { StackProps } from "./Stack.types";

const TABLE_COLUMNS = SIMPLE_USER_COLUMNS;
const TABLE_DATA = createRandomSimpleUsers(20);

export default {
  title: "Stack",
  component: Stack,
  args: {
    children: (
      <>
        <Card>1</Card>
        <Card>2</Card>
        <Card>3</Card>
      </>
    ),
  },
  argTypes: {
    spacing: { type: "number" },
  },
} as Meta<typeof Stack>;

const Template: StoryFn<StackProps> = ({ children, ...args }) => {
  // Unwrap children if they are nested in a React fragment.
  let nonFragmentChildren = children;
  while (
    (nonFragmentChildren as ReactElement | undefined)?.type === Fragment &&
    (nonFragmentChildren as ReactElement | undefined)?.props?.children
  ) {
    nonFragmentChildren = (nonFragmentChildren as ReactElement).props.children;
  }

  return <Stack {...args}>{nonFragmentChildren}</Stack>;
};

export const Row = Template.bind({});
Row.args = {
  direction: "row",
  sx: { height: 400, border: "1px solid black", padding: 10 },
};

export const RowGrow = Template.bind({});
RowGrow.args = {
  direction: "row",
  children: (
    <>
      <Card grow>1</Card>
      <Card grow>2</Card>
      <Card grow>3</Card>
    </>
  ),
};

export const Column = Template.bind({});
Column.args = {
  direction: "column",
};

export const ColumnGrow = Template.bind({});
ColumnGrow.args = {
  direction: "column",
  children: (
    <>
      <Card grow>1</Card>
      <Card grow>2</Card>
      <Card grow>3</Card>
    </>
  ),
  sx: { height: 400, border: "1px solid black", padding: 10 },
};

export const Styled = Template.bind({});
Styled.args = {
  sx: {
    background: THEME.colors.cyan[1],
    padding: 10,
    height: 500,
    border: "1px solid black",
  },
};

export const DifferentWidths = Template.bind({});
DifferentWidths.args = {
  children: (
    <>
      <Card width="1/12">1/12</Card>
      <Card width="2/12">2/12</Card>
      <Card width="3/12">3/12</Card>
      <Card width="6/12">6/12</Card>
    </>
  ),
  direction: "row",
};

export const ChildGrow = Template.bind({});
ChildGrow.args = {
  children: (
    <>
      <Card width="1/2">I take up 1/2 the space</Card>
      <Card grow>I fit my content (content)</Card>
    </>
  ),
  direction: "row",
};

export const Responsive = Template.bind({});
Responsive.args = {
  children: (
    <>
      <Card width="128u" grow>
        I grow as the screen gets smaller
      </Card>
      <Card width="128u" grow>
        I grow as the screen gets smaller
      </Card>
      <Card width="128u" grow>
        I grow as the screen gets smaller
      </Card>
    </>
  ),
  wrap: true,
  direction: "row",
};

export const Justify = Template.bind({});
Justify.args = {
  children: (
    <>
      <Card width="3/6">hi</Card>
      <Card width="1/6">hi</Card>
    </>
  ),
  justify: "end",
  direction: "row",
};

export const MainDetail = Template.bind({});
MainDetail.args = {
  children: (
    <>
      <Card width="3/4" grow>
        <Text>{`# Main content
Put the main stuff in here
- Some
- Bulleted
- List
`}</Text>
      </Card>
      <Card grow>
        <Text>{`# Secondary content
Put details
- Some
- Bulleted
- List

When the screen gets small I take up the whole row.
`}</Text>
      </Card>
    </>
  ),
  wrap: true,
  direction: "row",
};

export const Dashboard = () => {
  return (
    <Stack>
      <Stack direction="row" wrap>
        <Card grow>
          <Text>I take up as much room as I need</Text>
        </Card>
        <Card grow>
          <Text>{`# Me too
- I just
- need
- a lot
- more room to grow to my fullest potential`}</Text>
        </Card>
        <Table columns={TABLE_COLUMNS} data={TABLE_DATA} width="1/2" grow />
      </Stack>
      <Stack direction="row" wrap>
        <Card grow>
          I take up all the room I need and I need a little bit more room
        </Card>
        <Card grow>I take up as much room as I need</Card>
        <Card grow>I take up as much room as I need Just a bit more</Card>
        <Card grow>
          <Text>{`# Me too
      - I just
      - need
      - a lot
      - more room to grow to my fullest potential`}</Text>
        </Card>
      </Stack>
      <Stack direction="row" wrap>
        <Card grow>I take up as much room as I need</Card>
        <Table columns={TABLE_COLUMNS} data={TABLE_DATA} width="1/2" grow />
      </Stack>
    </Stack>
  );
};

export const WithTables = Template.bind({});
WithTables.args = {
  children: (
    <>
      <Stack width="1/2">
        <Text>First table takes up half the screen</Text>
        <Table columns={TABLE_COLUMNS} data={TABLE_DATA} />
      </Stack>
      <Table columns={TABLE_COLUMNS} data={TABLE_DATA} />
      <Table columns={TABLE_COLUMNS} data={TABLE_DATA} />
    </>
  ),
  direction: "row",
};

export const Scroll = Template.bind({});
Scroll.args = {
  scroll: true,
  height: "32u",
};

export const NoScroll = Template.bind({});
NoScroll.args = {
  scroll: false,
  height: "32u",
};
