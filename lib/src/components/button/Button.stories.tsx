import { Meta, StoryFn } from "@storybook/react";

import { CogIconMini } from "components/icon";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";

import { Button } from "./Button";

const scaleSignalMock = {
  url: "http://api/v0/runners/createScaleSignal",
  method: "POST",
  status: 200,
  response: {},
};

const searchEntitiesMock = {
  url: "http://api/v0/entities/search?q=&scope=all",
  method: "GET",
  status: 200,
  response: {
    results: [
      {
        user: null,
        group: {
          id: "1q0LViSn4DA0bahEdYZqIIypnnB",
          name: "Admins",
        },
      },
      {
        user: {
          userID: "usr20220418zesvznlxh9i",
          name: "Ameya Khare",
          avatarURL:
            "https://lh3.googleusercontent.com/a-/AFdZucoAo3fpqvYZfuIDWTlITAXCtmAKAYe_mqXAaFZj=s96-c",
        },
        group: null,
      },
      {
        user: {
          userID: "prof_01EWE7360JQCXWTPTRQV9R569X",
          name: "Benjamin Yolken",
          avatarURL:
            "https://lh3.googleusercontent.com/a-/AOh14GgJKddngvPf3UTcsYMWOpgzscSli9YWEqJssOnX=s96-c",
        },
        group: null,
      },
      {
        user: {
          userID: "prof_01EWE7360JQCXWTPTRQV9R569N",
          name: "Colin King",
          avatarURL:
            "https://lh3.googleusercontent.com/a-/AOh14Gglo5JTMHELUSzEg8puAP_98YqAtfJhhWnoHvOm=s96-c",
        },
        group: null,
      },
      {
        user: {
          userID: "usr20220429zeofnm8hkmw",
          name: "George Du",
          avatarURL:
            "https://lh3.googleusercontent.com/a-/AFdZucoyKtpOD1IhdGLIzr-H8aTyIRPLYvUm7-Y4aZBY=s96-c",
        },
        group: null,
      },
    ],
  },
};

const mockDataRequest = [
  {
    url: "http://api/v0/permissions/get?task_slug=list_accounts&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": false, "tasks.request_run": true },
    },
  },
  {
    url: "http://api/v0/tasks/getTaskReviewers?taskSlug=list_accounts",
    method: "GET",
    status: 200,
    response: {
      task: {
        name: "List Accounts",
        requireExplicitPermissions: false,
        triggers: [
          {
            kind: "form",
            triggerID: "trg20210728z3095m5",
          },
        ],
      },
      reviewers: [],
    },
  },
  searchEntitiesMock,
  {
    url: "http://api/v0/requests/create",
    method: "POST",
    status: 200,
    response: { triggerRequestID: "trq20220830z4hycm98kq0" },
  },
  scaleSignalMock,
];

export const mockDataExecute = [
  {
    url: "http://api/v0/permissions/get?task_slug=list_accounts&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": true, "tasks.request_run": true },
    },
  },
  scaleSignalMock,
];

const mockDataDisabled = [
  {
    url: "http://api/v0/permissions/get?task_slug=list_accounts&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": false, "tasks.request_run": false },
    },
  },
  scaleSignalMock,
];

export default {
  title: "Button",
  component: Button,
  args: {
    children: "Click me",
  },
  argTypes: {
    onClick: { action: "click" },
  },
  excludeStories: ["mockDataExecute"],
  parameters: { mockData: mockDataExecute },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
  preset: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  preset: "secondary",
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  preset: "tertiary",
};

export const Danger = Template.bind({});
Danger.args = {
  preset: "danger",
};

export const Subtle = Template.bind({});
Subtle.args = {
  variant: "subtle",
};

export const OverridePreset = Template.bind({});
OverridePreset.args = {
  preset: "danger",
  variant: "outline",
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};

export const Link = Template.bind({});
Link.args = {
  href: "https://www.airplane.dev",
};

export const LoadingLink = Template.bind({});
LoadingLink.args = {
  href: "https://www.airplane.dev",
  loading: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  leftIcon: <CogIconMini />,
};

export const WithConfirmation = Template.bind({});
WithConfirmation.args = {
  confirm: true,
};

export const WithConfirmationAndOptions = Template.bind({});
WithConfirmationAndOptions.args = {
  confirm: {
    title: "Do a thing",
    confirmText: "Do the thing",
    cancelText: "Don't do the thing",
    body: <Text>Are you sure you want to do a thing?</Text>,
  },
};

export const ExecuteTask = () => {
  return <Button task="list_accounts">Click me</Button>;
};

export const RequestTask = () => {
  return <Button task="list_accounts">Click me</Button>;
};
RequestTask.parameters = { mockData: mockDataRequest };

export const RequestTaskWithConfirmation = () => {
  return (
    <Button task="list_accounts" confirm>
      Click me
    </Button>
  );
};
RequestTaskWithConfirmation.parameters = { mockData: mockDataRequest };

export const RequestTaskDisabled = () => {
  return <Button task="list_accounts">Click me</Button>;
};
RequestTaskDisabled.parameters = { mockData: mockDataDisabled };

const mockDataRunbook = [
  {
    url: "http://api/v0/permissions/get?runbook_slug=list_accounts&actions=runbooks.execute&actions=trigger_requests.create",
    method: "GET",
    status: 200,
    response: {
      resource: { "runbooks.execute": false, "trigger_requests.create": true },
    },
  },
  {
    url: "http://api/v0/runbooks/get?runbookSlug=run_book",
    method: "GET",
    status: 200,
    response: {
      runbook: {
        name: "Run Book",
        isPrivate: false,
        triggers: [
          {
            kind: "form",
            triggerID: "trg20210728z3095m5",
          },
        ],
      },
      reviewers: [],
    },
  },
  searchEntitiesMock,
  {
    url: "http://api/v0/requests/create",
    method: "POST",
    status: 200,
    response: { triggerRequestID: "trq20220830z4hycm98kq0" },
  },
];

export const RequestRunbook = () => {
  return <Button runbook="run_book">Click me</Button>;
};
RequestRunbook.parameters = { mockData: mockDataRunbook };

export const ButtonVariantsAndColors = () => {
  return (
    <Stack spacing="sm">
      <Button variant="filled">Filled</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="light">Light</Button>
      <Button variant="subtle">Subtle</Button>
      <Button preset="secondary" color="red">
        Secondary Red
      </Button>
      <Button variant="outline" color="red">
        Outline Red
      </Button>
      <Button variant="filled" color="teal">
        Filled Teal
      </Button>
      <Button variant="outline" color="teal">
        Outline Teal
      </Button>
      <Button variant="light" color="teal">
        Light Teal
      </Button>
      <Button variant="subtle" color="teal">
        Subtle Teal
      </Button>
      <Button variant="outline" color="gray">
        Outline gray
      </Button>
      <Button preset="tertiary">Tertiary</Button>
      <Button preset="danger" href="https://app.airplane.dev">
        Tertiary link button
      </Button>
      <Button preset="tertiary" href="https://app.airplane.dev">
        Tertiary link button
      </Button>
      <Button color="teal" href="https://app.airplane.dev">
        Teal link button
      </Button>
      <Button compact>Compact</Button>
    </Stack>
  );
};
