import { ComponentMeta, Story } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Button } from "components/button/Button";
import { mockDataExecute } from "components/button/Button.stories";
import { Card } from "components/card/Card";
import { Link } from "components/link/Link";
import { Stack } from "components/stack/Stack";
import { TextInput } from "components/textinput/TextInput";
import { useComponentState } from "state";
import { drag } from "storybook-utils/drag";
import { mockRunData } from "storybook-utils/mockRunData";

import { Table } from "./Table";
import { TableProps } from "./Table.types";
import {
  createRandomSimpleUsers,
  createRandomUsers,
  EDITABLE_COLUMNS,
  NULL_DATA_COLUMNS,
  SIMPLE_USER_COLUMNS,
  SimpleUser,
  User,
  USER_COLUMNS,
  WRAPPED_COLUMNS,
} from "./testdata";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template = <T extends object = Record<string, any>>(
  args: TableProps<T>
) => <Table<T> {...args} />;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TemplateFn = <T extends object = Record<string, any>>(): Story<
  TableProps<T>
> => Template;

const SIMPLE_DATA_COLUMNS = SIMPLE_USER_COLUMNS;

const SIMPLE_DATA = createRandomSimpleUsers(20);
const DATA = createRandomUsers(20);

export default {
  title: "Table",
  component: Table,
  parameters: {
    mockData: [
      ...mockDataExecute,
      ...mockRunData("run123", () => createRandomSimpleUsers(20)),
      {
        url: "http://api/v0/tasks/getMetadata?slug=impersonate",
        method: "GET",
        status: 200,
        response: {
          slug: "impersonate",
          id: "tsk123",
        },
      },
      {
        url: "http://api/v0/hosts/web",
        method: "GET",
        status: 200,
        response: ["host"],
      },
    ],
  },
} as ComponentMeta<typeof Table>;

export const Simple = TemplateFn<SimpleUser>().bind({});
Simple.args = {
  data: SIMPLE_DATA,
  title: "Simple Table with a label",
  columns: SIMPLE_DATA_COLUMNS,
  defaultPageSize: 10,
};

export const SimpleNoChrome = TemplateFn<SimpleUser>().bind({});
SimpleNoChrome.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  defaultPageSize: 10,
  showFilter: false,
};

export const InlineData = () => {
  // Component state is required to trigger potential rerendering bugs
  const componentState = useComponentState();
  return (
    <Table
      id={componentState.id}
      title="Cats"
      defaultPageSize={3}
      columns={[
        {
          label: "Name",
          accessor: "name",
        },
        {
          label: "Breed",
          accessor: "breed",
        },
      ]}
      data={[
        { name: "Graham Cracker", breed: "British Shorthair" },
        { name: "Bootz", breed: "American Wirehair" },
        { name: "Hazel", breed: "Taby" },
        { name: "Xiaohuang", breed: "Abyssinian" },
        { name: "Peaches", breed: "Birman" },
        { name: "Baosky", breed: "British Shorthair" },
      ]}
      isDefaultSelectedRow={(r, i) => i === 0}
      rowSelection="single"
    />
  );
};

export const RefetchTask = () => {
  const queryClient = useQueryClient();
  return (
    <Stack>
      <Table
        task="get_table_data"
        title="Task-based table"
        columns={SIMPLE_DATA_COLUMNS}
        defaultPageSize={10}
        isDefaultSelectedRow={(r, i) => i === 0}
        rowSelection="single"
      />
      <Button onClick={() => queryClient.invalidateQueries()}>
        Refetch tasks
      </Button>
    </Stack>
  );
};

export const NoFilter = TemplateFn<SimpleUser>().bind({});
NoFilter.args = {
  data: SIMPLE_DATA,
  title: "Simple Table with no filter",
  columns: SIMPLE_DATA_COLUMNS,
  defaultPageSize: 10,
  showFilter: false,
};

const MANY_COLUMNS_DATA_COLUMNS = USER_COLUMNS;

const MANY_COLUMNS_DATA = createRandomUsers(20);

export const ManyColumns = TemplateFn<User>().bind({});
ManyColumns.args = {
  data: MANY_COLUMNS_DATA,
  columns: MANY_COLUMNS_DATA_COLUMNS,
};

export const Empty = TemplateFn<SimpleUser>().bind({});
Empty.args = {
  data: [],
  columns: SIMPLE_DATA_COLUMNS,
  noData: "No data here!",
};

export const Loading = TemplateFn<SimpleUser>().bind({});
Loading.args = {
  data: [],
  columns: SIMPLE_DATA_COLUMNS,
  loading: true,
};

export const RowActions = TemplateFn<SimpleUser>().bind({});
RowActions.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowActions: ["Delete", "Mark as churned using unnecessarily long button"],
  rowSelection: "single",
};
RowActions.parameters = {
  chromatic: { diffThreshold: 0.5 },
};

export const RowActionsMenu = TemplateFn<SimpleUser>().bind({});
RowActionsMenu.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowActionsMenu: ["Yeet", "Yeet2"],
  rowSelection: "single",
  freezeRowActions: false,
};

export const RowActionsLinkButtons = TemplateFn<SimpleUser>().bind({});
RowActionsLinkButtons.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowActions: [
    {
      label: "Impersonate",
      preset: "tertiary",
      href: (row) => {
        return { task: "impersonate", params: { id: row.userID } };
      },
    },
    {
      label: "Search user",
      preset: "tertiary",
      href: (row) => `https://www.google.com/search?q=${row.username}`,
    },
  ],
  rowActionsMenu: [
    {
      label: "Another one",
      href: () => "https://www.airplane.dev",
      preset: "tertiary",
      variant: "subtle",
    },
  ],
  rowSelection: "single",
  freezeRowActions: false,
};
RowActionsLinkButtons.parameters = {
  // Wait for permissions to load
  chromatic: { delay: 300 },
};

export const CustomizedRowActions = TemplateFn<SimpleUser>().bind({});
CustomizedRowActions.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowActions: [
    {
      slug: "del",
      label: "Delete",
      preset: "primary",
      confirm: (row) => {
        return { body: `Are you sure you want to delete ${row.username}?` };
      },
    },
    {
      label: "Alert with confirm",
      preset: "primary",
      confirm: (row) => {
        return { body: `Are you sure you want to alert on ${row.username}?` };
      },
      onClick: (user) => window.alert(user.username),
    },
  ],
  rowActionsMenu: [
    {
      slug: "churn",
      label: "Mark as churned",
      preset: "tertiary",
      variant: "subtle",
      confirm: true,
    },
    {
      label: "Alert",
      preset: "tertiary",
      variant: "subtle",
      onClick: (user) => window.alert(user.username),
    },
  ],
  rowSelection: "single",
  freezeRowActions: false,
};
CustomizedRowActions.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  setTimeout(
    async () =>
      await userEvent.click((await canvas.findAllByText("Delete"))[0]),
    750
  );
};
CustomizedRowActions.parameters = {
  // TODO(PDS-2123): Fix flaky story
  chromatic: { disableSnapshot: true },
};

export const WithError = TemplateFn<SimpleUser>().bind({});
WithError.args = {
  data: [],
  columns: SIMPLE_DATA_COLUMNS,
  error: "Something went wrong — please reload the page",
};

export const SingleSelection = TemplateFn<SimpleUser>().bind({});
SingleSelection.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowSelection: "single",
  isDefaultSelectedRow: (row, idx) => idx === 1,
};

export const ControlledSelection = () => {
  const [t, setT] = useState(2);
  const [username, setUsername] = useState(SIMPLE_DATA[t].username);
  const tableState = useComponentState("table");
  useEffect(() => {
    setUsername(SIMPLE_DATA[t].username);
  }, [t]);
  const onToggleRow = useCallback(
    (row: SimpleUser, idx: number) => {
      if (username === row.username) {
        setUsername("");
      } else {
        setUsername(row.username);
      }
    },
    [setUsername, username]
  );
  return (
    <Stack>
      <Button onClick={() => setT(t + 1)}>Increment</Button>
      <Table
        id="table"
        data={SIMPLE_DATA}
        columns={SIMPLE_DATA_COLUMNS}
        rowSelection="single"
        isSelectedRow={(row) => row.username === username}
        onToggleRow={onToggleRow}
      />
      {JSON.stringify(tableState?.selectedRows)}
    </Stack>
  );
};

export const MultiSelection = TemplateFn<SimpleUser>().bind({});
MultiSelection.args = {
  data: SIMPLE_DATA,
  columns: SIMPLE_DATA_COLUMNS,
  rowSelection: "checkbox",
};
MultiSelection.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await canvas.findByText("User ID");
  const checkboxes = await canvas.findAllByRole("checkbox");
  await userEvent.click(checkboxes[1]);
};

export const ControlledMultiSelection = () => {
  const [t, setT] = useState(2);
  const [usernames, setUsernames] = useState([SIMPLE_DATA[t].username]);
  const tableState = useComponentState("table");
  useEffect(() => {
    setUsernames([SIMPLE_DATA[t].username]);
  }, [t]);
  const onToggleRow = useCallback(
    (row: SimpleUser, idx: number) => {
      if (usernames.includes(row.username)) {
        setUsernames(usernames.filter((username) => username !== row.username));
      } else {
        setUsernames([...usernames, row.username]);
      }
    },
    [setUsernames, usernames]
  );
  const isSelectedRow = useCallback(
    (row: SimpleUser) => usernames.includes(row.username),
    [usernames]
  );
  return (
    <Stack>
      <Button onClick={() => setT(t + 1)}>Increment</Button>
      <Table
        id="table"
        data={SIMPLE_DATA}
        columns={SIMPLE_DATA_COLUMNS}
        rowSelection="checkbox"
        isSelectedRow={isSelectedRow}
        onToggleRow={onToggleRow}
      />
      {JSON.stringify(tableState?.selectedRows)}
    </Stack>
  );
};

export const EditableColumns = TemplateFn<User>().bind({});
EditableColumns.args = {
  data: DATA,
  columns: EDITABLE_COLUMNS,
  rowActionsMenu: ["Yeet"],
  rowSelection: "single",
};

export const WrappedColumns = TemplateFn<User>().bind({});
WrappedColumns.args = {
  data: DATA,
  columns: WRAPPED_COLUMNS,
};

export const ColumnOrder = TemplateFn<User>().bind({});
ColumnOrder.args = {
  data: DATA,
  columns: ["birthdate", "username", "address"],
};

export const CustomElements = TemplateFn<SimpleUser>().bind({});
CustomElements.args = {
  data: SIMPLE_DATA,
  title: "Simple Table with a label",
  columns: [
    {
      accessor: "userID",
      label: "User ID",
      Component: ({ value: userID }) => <Card>{userID}</Card>,
    },
    {
      accessor: "username",
      label: "Username",
      canEdit: true,
      Component: ({ value: username, startEditing }) => (
        <Stack>
          <Link href={`airplane.dev?id=${username}`}>{username}</Link>
          zhan-airplane marked this conversation as resolved. Show resolved
          <Button onClick={startEditing}>Edit me</Button>
        </Stack>
      ),
      EditComponent: ({ defaultValue, finishEditing }) => {
        const [value, setValue] = useState(defaultValue);
        return (
          <Stack>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button
              onClick={() => {
                finishEditing(value);
              }}
            >
              Save
            </Button>
          </Stack>
        );
      },
    },
  ],
  defaultPageSize: 10,
};

export const NullData = TemplateFn().bind({});
NullData.args = {
  columns: Object.values(NULL_DATA_COLUMNS),
  data: [
    Object.fromEntries(
      Object.keys(NULL_DATA_COLUMNS).map((key) => [key, null])
    ),
  ],
};

export const UndefinedData = TemplateFn().bind({});
UndefinedData.args = {
  columns: Object.values(NULL_DATA_COLUMNS),
  data: [{}],
};

export const WithComponentError = () => {
  return (
    <div data-chromatic="ignore">
      {/* Erroring table */}
      {/* @ts-expect-error */}
      <Table data={SIMPLE_DATA} columns={5} />
      {/* Working table */}
      <Table data={SIMPLE_DATA} />
    </div>
  );
};

export const WithCSVDownloadButton = TemplateFn<SimpleUser>().bind({});
WithCSVDownloadButton.args = {
  data: SIMPLE_DATA,
  title: "Table with CSV download button",
  columns: SIMPLE_DATA_COLUMNS,
  defaultPageSize: 10,
  enableCSVDownload: true,
};

export const ResizedColumn = TemplateFn<SimpleUser>().bind({});
ResizedColumn.args = {
  data: SIMPLE_DATA,
  title: "Resized column",
  columns: SIMPLE_DATA_COLUMNS,
  defaultPageSize: 10,
};
ResizedColumn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  setTimeout(async () => {
    const dragHandle = canvas.getByRole("separator");
    await drag(dragHandle, {
      delta: { x: -200, y: 0 },
    });
  }, 750);
};
ResizedColumn.parameters = {
  chromatic: { delay: 1500 },
};
