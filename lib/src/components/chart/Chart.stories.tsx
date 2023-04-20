import { ComponentMeta, Story } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import { Button } from "components/button/Button";
import { Stack } from "components/stack/Stack";
import { Tabs } from "components/tabs/Tabs";
import { Text } from "components/text/Text";
import { ChartState, useComponentState } from "state";

import { Chart } from "./Chart";
import { ChartProps } from "./Chart.types";

export default {
  title: "Chart",
  component: Chart,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as ComponentMeta<typeof Chart>;

const Template: Story<ChartProps> = (args) => <Chart {...args} />;

export const Scatter = Template.bind({});
Scatter.args = {
  title: "My scatter chart",
  type: "scatter",
  data: [
    { x: 0, square: 0, cube: 0 },
    { x: 1, square: 1, cube: 1 },
    { x: 2, square: 4, cube: 9 },
    { x: 3, square: 9, cube: 27 },
    { x: 4, square: 16, cube: 64 },
  ],
  xAxisTitle: "The X Value",
  yAxisTitle: "Some Y Value",
  legendPosition: "bottom",
};

export const ScatterWithDeselect = () => {
  const { selectedPoints, clearSelection } =
    useComponentState<ChartState>("chart");
  return (
    <Stack>
      <Chart
        id="chart"
        type="scatter"
        data={[
          { x: 0, square: 0 },
          { x: 1, square: 1 },
          { x: 2, square: 4 },
        ]}
      />
      <Button onClick={clearSelection}>Clear selection</Button>
      <Text>{JSON.stringify(selectedPoints)}</Text>
    </Stack>
  );
};

export const ScatterLog = Template.bind({});
ScatterLog.args = {
  title: "Exponential data",
  type: "scatter",
  data: [
    { x: 0, square: 0, cube: 0 },
    { x: 1, square: 1, cube: 1 },
    { x: 2, square: 4, cube: 9 },
    { x: 3, square: 9, cube: 27 },
    { x: 4, square: 16, cube: 64 },
  ],
  yAxisType: "log",
};

export const ScatterWithObject = Template.bind({});
ScatterWithObject.args = {
  title: "Scatter with object and datasets",
  type: "scatter",
  data: {
    misc: [1, 1, 1],
    x: ["2022-01-01", "2022-02-01", "2022-03-01", "2022-04-01", "2022-05-01"],
    square: [0, 1, 4, 9, 16],
    cube: [0, 1, 9, 27, 64],
    linear: [0, 1, 2, 3, 4],
  },
  xAxis: "x",
  datasets: ["square", "linear"],
  legendPosition: "right",
};

export const Bar = Template.bind({});
Bar.args = {
  title: "My bar chart",
  type: "bar",
  data: {
    x: ["one", "two", "three"],
    square: [0, 1, 4, 9, 16],
    cube: [0, 1, 9, 27, 64],
    linear: [0, 1, 2, 3, 4],
  },
};

export const StackedBar = Template.bind({});
StackedBar.args = {
  title: "My bar chart",
  type: "bar",
  mode: "stack",
  data: {
    x: ["one", "two", "three"],
    square: [0, 1, 4, 9, 16],
    cube: [0, 1, 9, 27, 64],
    linear: [0, 1, 2, 3, 4],
  },
};

export const Line = Template.bind({});
Line.args = {
  title: "Active users",
  type: "line",
  data: {
    x: [0, 1, 2, 3, 4, 5],
    wau: [0, 2, 4, 8, 16, 32],
    mau: [0, 3, 9, 27, 81, 243],
  },
};

export const LineWithPercents = Template.bind({});
LineWithPercents.args = {
  title: "Percentage",
  type: "line",
  data: {
    x: [0, 1, 2, 3, 4, 5],
    Percent: [0.1, 0.2, 0.32, 0.45],
  },
  yAxisFormat: ".0%",
  colors: {
    Percent: "green",
  },
};

export const LineWithColors = Template.bind({});
LineWithColors.args = {
  type: "line",
  data: {
    x: [0, 1, 2, 3, 4, 5],
    green: [0, 2, 4, 8, 16, 32],
    violet: [0, 3, 9, 27, 81, 243],
    rgb: [10, 10, 10, 10, 10, 10],
  },
  colors: {
    green: "green",
    violet: "violet",
    rgb: "rgb(100, 200, 130)",
  },
};

export const Pie = Template.bind({});
Pie.args = {
  title: "My pie chart",
  type: "pie",
  data: {
    valuesA: [100, 200, 300, 400, 500, 600, 700, 800],
    valuesB: [300, 300, 400],
  },
  dataset: "valuesA",
  labels: ["a", "b", "c", "d", "e", "f", "g", "h"],
};

export const PieWithColors = Template.bind({});
PieWithColors.args = {
  title: "My pie chart",
  type: "pie",
  data: {
    valuesA: [100, 200, 300],
  },
  colors: ["red", "green", "blue"],
};

export const Loading = Template.bind({});
Loading.args = {
  title: "My loading chart",
  type: "scatter",
  data: [],
  loading: true,
};

export const InTabs = () => {
  return (
    <Tabs defaultValue="overview">
      <Tabs.Tab value="overview" label="Overview">
        Overview content here
      </Tabs.Tab>
      <Tabs.Tab value="chart" label="Chart">
        <Chart
          id="chart"
          type="scatter"
          data={[
            { x: 0, square: 0 },
            { x: 1, square: 1 },
            { x: 2, square: 4 },
          ]}
        />
      </Tabs.Tab>
    </Tabs>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
InTabs.play = async ({ canvasElement }: any) => {
  const canvas = within(canvasElement);
  await canvas.findByText("Overview content here");
  await userEvent.click(await canvas.findByText("Chart"));
  await canvas.findByText("square");
};
InTabs.parameters = {
  // Wait for chart to resize.
  chromatic: { delay: 300 },
};
