import { Meta, StoryFn } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useState } from "react";

import { Button } from "components/button/Button";
import { DescriptionList } from "components/descriptionList/DescriptionList";
import { Form } from "components/form/Form";
import { Heading } from "components/heading/Heading";
import { PhotoIcon, InboxIcon, Cog6ToothIcon } from "components/icon";
import { Dashboard } from "components/samples/Dashboard.stories";
import { Select } from "components/select/Select";
import { Slider } from "components/slider/Slider";
import { Stack } from "components/stack/Stack";
import { Table } from "components/table/Table";
import { Text } from "components/text/Text";
import { Textarea } from "components/textarea/Textarea";
import { TextInput } from "components/textinput/TextInput";
import { useComponentState, TabsState } from "state";

import { Tabs } from "./Tabs";
import { TabsProps } from "./Tabs.types";

export default {
  title: "Tabs",
  component: Tabs,
  args: {
    defaultValue: "gallery",
    children: (
      <>
        <Tabs.Tab value="gallery" label="Gallery">
          <>
            <Heading>Gallery page</Heading>
            <Dashboard />
          </>
        </Tabs.Tab>
        <Tabs.Tab value="messages" label="Messages">
          <>
            <Heading>Messages page</Heading>
            <Dashboard />
          </>
        </Tabs.Tab>
        <Tabs.Tab value="settings" label="Settings">
          <>
            <Heading>Settings page</Heading>
            <Dashboard />
          </>
        </Tabs.Tab>
      </>
    ),
  },
} as Meta<typeof Tabs>;

const Template: StoryFn<TabsProps> = (props) => <Tabs {...props} />;

export const Default = Template.bind({});
Default.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await canvas.findByText("Gallery page");
  await userEvent.click(await canvas.findByText("Messages"));
  await canvas.findByText("Messages page");
};

export const PlacementBottom = Template.bind({});
PlacementBottom.args = {
  placement: "bottom",
};

export const PlacementLeft = Template.bind({});
PlacementLeft.args = {
  placement: "left",
};

export const PlacementRight = Template.bind({});
PlacementRight.args = {
  placement: "right",
};

export const Grow = Template.bind({});
Grow.args = {
  grow: true,
};

export const VerticalGrow = Template.bind({});
VerticalGrow.args = {
  grow: true,
  placement: "left",
};

export const PositionEnd = Template.bind({});
PositionEnd.args = {
  position: "end",
};

export const PositionCenter = Template.bind({});
PositionCenter.args = {
  position: "center",
};

export const PositionApart = Template.bind({});
PositionApart.args = {
  position: "apart",
};

export const VerticalPositionEnd = Template.bind({});
VerticalPositionEnd.args = {
  position: "end",
  placement: "left",
};

export const VerticalPositionCenter = Template.bind({});
VerticalPositionCenter.args = {
  position: "center",
  placement: "left",
};

export const VerticalPositionApart = Template.bind({});
VerticalPositionApart.args = {
  position: "apart",
  placement: "left",
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  children: (
    <>
      <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab value="messages" icon={<InboxIcon />} label="Messages">
        Messages tab content
      </Tabs.Tab>
      <Tabs.Tab value="settings" icon={<Cog6ToothIcon />} label="Click me">
        Settings tab content
      </Tabs.Tab>
    </>
  ),
};

export const MultipleColors = Template.bind({});
MultipleColors.args = {
  children: (
    <>
      <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab
        value="messages"
        icon={<InboxIcon />}
        label="Messages"
        color="secondary"
      >
        Messages tab content
      </Tabs.Tab>
      <Tabs.Tab
        value="settings"
        icon={<Cog6ToothIcon />}
        label="Click me"
        color="green"
      >
        Settings tab content
      </Tabs.Tab>
    </>
  ),
};

export const DifferentPanelContentSize = () => (
  // In order for vertical tabs to not resize when content is different sizes, set a height on the parent container of the Tabs
  <Stack sx={{ height: "60vh" }}>
    <Tabs
      placement="left"
      position="center"
      defaultValue="overview"
      keepMounted={false}
    >
      <Tabs.Tab value="overview" icon={<PhotoIcon />} label="Customer overview">
        <Table
          data={[
            { userID: 1, name: "Bob" },
            { userID: 2, name: "Joe" },
          ]}
        />
      </Tabs.Tab>
      <Tabs.Tab value="detail" icon={<InboxIcon />} label="Customer detail">
        <DescriptionList
          items={[
            { term: "Name", description: "Bob" },
            { term: "Company", description: "Happy Llamas Inc" },
            { term: "Customer since", description: "Feb 2021" },
          ]}
        />
      </Tabs.Tab>
      <Tabs.Tab
        value="settings"
        icon={<Cog6ToothIcon />}
        label="Add new customer"
      >
        <Form>
          <TextInput id="name" label="Name" />
          <Select
            id="role"
            label="Role"
            data={["Engineer", "Support", "CEO"]}
          />
          <Textarea id="description" label="Description" />
          <Slider
            label="T-shirt size"
            id="tshirt-size"
            min={0}
            max={5}
            marks={[
              { value: 0, label: "XS" },
              { value: 1, label: "S" },
              { value: 2, label: "M" },
              { value: 3, label: "L" },
              { value: 4, label: "XL" },
            ]}
          />
        </Form>
      </Tabs.Tab>
    </Tabs>
  </Stack>
);

export const DisabledTab = () => {
  return (
    <Tabs defaultValue="gallery">
      <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab value="messages" icon={<InboxIcon />} label="Messages" disabled>
        Messages tab content
      </Tabs.Tab>
      <Tabs.Tab value="settings" icon={<Cog6ToothIcon />} label="Settings">
        Settings tab content
      </Tabs.Tab>
    </Tabs>
  );
};

export const OnTabChange = () => {
  return (
    <Tabs defaultValue="gallery" onTabChange={(value) => window.alert(value)}>
      <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
        Gallery tab content
      </Tabs.Tab>
      <Tabs.Tab value="messages" icon={<InboxIcon />} label="Messages">
        Messages tab content
      </Tabs.Tab>
      <Tabs.Tab value="settings" icon={<Cog6ToothIcon />} label="Settings">
        Settings tab content
      </Tabs.Tab>
    </Tabs>
  );
};

export const UncontrolledUsage = () => {
  const tabsState = useComponentState<TabsState>("tabs");

  return (
    <Stack>
      <Tabs id="tabs" value={tabsState.value} defaultValue="gallery">
        <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
          Gallery tab content
        </Tabs.Tab>
        <Tabs.Tab value="messages" icon={<InboxIcon />} label="Messages">
          Messages tab content
        </Tabs.Tab>
        <Tabs.Tab value="settings" icon={<Cog6ToothIcon />} label="Settings">
          Settings tab content
        </Tabs.Tab>
      </Tabs>
      <Button onClick={() => tabsState.setValue("messages")}>
        click me to switch to messages
      </Button>
      <Text>state: {tabsState.value}</Text>
    </Stack>
  );
};

export const ControlledUsage = () => {
  const [tabsValue, setTabsValue] = useState("gallery");

  return (
    <Stack>
      <Tabs id="tabs" value={tabsValue} onTabChange={(v) => setTabsValue(v)}>
        <Tabs.Tab value="gallery" icon={<PhotoIcon />} label="Gallery">
          Gallery tab content
        </Tabs.Tab>
        <Tabs.Tab value="messages" icon={<InboxIcon />} label="Messages">
          Messages tab content
        </Tabs.Tab>
        <Tabs.Tab value="settings" icon={<Cog6ToothIcon />} label="Settings">
          Settings tab content
        </Tabs.Tab>
      </Tabs>
      <Text>tabsValue: {tabsValue}</Text>
    </Stack>
  );
};

export const WithComponentError = () => {
  return (
    <div data-chromatic="ignore">
      {/* Erroring tabs */}
      <Tabs defaultValue="gallery">
        {/* @ts-expect-error */}
        <Tabs.Tab1 value="gallery" label="Gallery">
          <Dashboard />
          {/* @ts-expect-error */}
        </Tabs.Tab1>
      </Tabs>
      {/* Working tabs */}
      <Tabs defaultValue="gallery">
        <Tabs.Tab value="gallery" label="Gallery">
          <Dashboard />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export const Unmounted = Template.bind({});
Unmounted.args = {
  keepMounted: false,
};
Unmounted.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await canvas.findByText("Gallery page");
  await userEvent.click(await canvas.findByText("Messages"));
  await canvas.findByText("Messages page");
};
