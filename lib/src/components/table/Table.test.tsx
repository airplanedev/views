import userEvent from "@testing-library/user-event";
import airplane from "airplane";
import { useState } from "react";

import { Button } from "components/button/Button";
import { formatDatetime } from "components/datepicker/DateTimePicker";
import { getRunErrorMessage } from "components/errorBoundary/ComponentErrorState";
import { Text } from "components/text/Text";
import { TextInput } from "components/textinput/TextInput";
import { ViewProvider } from "provider";
import { TableState, useComponentState } from "state";
import { describeExpectError } from "test-utils/describeExpectError";
import { setupTaskPermissions } from "test-utils/permissions/permissionsTestUtils";
import { rawRender, render, screen, within, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
  QueryProvider,
} from "test-utils/tasks/executeTaskTestUtils";

import { CellType } from "./Cell";
import { Table } from "./Table";
import { Column, TableProps, TableWithTaskProps } from "./Table.types";

// Mock out RequestRunnableDialog to avoid unhandled API calls.
jest.mock("components/requestDialog/RequestRunnableDialog", () => ({
  RequestRunnableDialog: jest.fn(),
}));

describe("Table", () => {
  beforeEach(() => {
    setupTaskPermissions();
  });

  type Row = {
    name: string;
    phone: string;
  };
  const columns: Column<Row>[] = [
    { label: "Name", accessor: "name" },
    { label: "Phone Number", accessor: "phone" },
  ];
  const data: Row[] = [
    {
      name: "Chester Delacruz",
      phone: "1-845-716-5093",
    },
    {
      name: "Orson Irwin",
      phone: "1-384-411-2149",
    },
  ];

  it("renders an empty table", async () => {
    render(<Table columns={[]} data={[]} />);
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("renders a table with data", () => {
    const { getAllByRole } = render(<Table columns={columns} data={data} />);
    const headers = getAllByRole("columnheader");
    expect(headers).toHaveLength(columns.length);
    expect(headers[0].textContent).toBe("Name");
    expect(headers[1].textContent).toBe("Phone Number");
    const cells = getAllByRole("cell");
    expect(cells).toHaveLength(data.length * columns.length);
    expect(cells[0].textContent).toBe(data[0].name);
    expect(cells[1].textContent).toBe(data[0].phone);
    expect(cells[2].textContent).toBe(data[1].name);
    expect(cells[3].textContent).toBe(data[1].phone);
  });

  it("renders dates from numbers", async () => {
    render(
      <Table
        columns={[{ label: "date", type: "date", accessor: "date" }]}
        data={[{ date: 1657131622218 }]}
      />
    );
    await screen.findByText("Jul 06, 2022");
  });

  it("static cells of different types", async () => {
    render(
      <Table
        columns={[
          { label: "string", accessor: "string" },
          {
            label: "number",
            accessor: "number",
          },
          {
            label: "JSON",
            accessor: "json",
          },
          { label: "Date", accessor: "date", type: "date" },
          { label: "DateTime", accessor: "datetime" },
          { label: "DateTimeString", accessor: "datetimeString" },
          {
            label: "Boolean",
            accessor: "bool",
          },
        ]}
        data={[
          {
            string: "My String",
            number: 1,
            json: { foo: "bar" },
            date: new Date("2022-07-06T00:00:00.000Z"),
            datetime: new Date("2022-07-06T00:00:00.000Z"),
            datetimeString: "2022-07-07T00:00:00.000Z",
            bool: true,
          },
        ]}
      />
    );
    await screen.findByText("My String");
    await screen.findByText(1);
    const c = await screen.findByRole("checkbox", { name: "toggle" });
    expect(c).toBeChecked();
    await screen.findByText(`"foo"`);
    await screen.findByText(`"bar"`);
    await screen.findByText("Jul 06, 2022");
    await screen.findByText(formatDatetime(new Date(2022, 6, 6)));
    await screen.findByText(formatDatetime(new Date(2022, 6, 7)));
  });

  it("supports pagination", async () => {
    const { getAllByRole } = render(
      <Table columns={columns} data={data} defaultPageSize={1} />
    );
    const headers = getAllByRole("columnheader");
    expect(headers).toHaveLength(columns.length);
    expect(headers[0].textContent).toBe("Name");
    expect(headers[1].textContent).toBe("Phone Number");
    let cells = getAllByRole("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0].textContent).toBe(data[0].name);
    expect(cells[1].textContent).toBe(data[0].phone);

    const next = await screen.findByRole("button", { name: "next" });
    const prev = await screen.findByRole("button", { name: "previous" });

    expect(prev).toBeDisabled();
    await screen.findByText("1 – 1 of 2");
    await userEvent.click(next);
    cells = await screen.findAllByRole("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0].textContent).toBe(data[1].name);
    expect(cells[1].textContent).toBe(data[1].phone);

    expect(next).toBeDisabled();
    await screen.findByText("2 – 2 of 2");
    await userEvent.click(prev);
    cells = await screen.findAllByRole("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0].textContent).toBe(data[0].name);
    expect(cells[1].textContent).toBe(data[0].phone);
  });

  it("starts resizing when holding on drag handle", async () => {
    const user = userEvent.setup();
    const columns: Column[] = [
      { label: "Name", accessor: "name" },
      { label: "Phone Number", accessor: "phone" },
    ];
    const { getByRole } = render(<Table columns={columns} data={[]} />);
    const namelabel = getByRole("columnheader", { name: "Name" });
    const dragHandle = within(namelabel).getByRole("separator");
    expect(dragHandle).toHaveClass("resizer");
    await user.pointer({ keys: "[MouseLeft>]", target: dragHandle });
    expect(dragHandle).toHaveClass("resizer isResizing");
  });

  it("renders the CSV download link correctly", async () => {
    render(
      <Table
        data={[
          { foo: "bar", foo2: "bar2" },
          {
            foo: "bar",
            foo2: `abc"\ndef`,
            hiddenColumn: "shouldn't be downloaded",
          },
        ]}
        columns={["foo", "foo2"]}
        enableCSVDownload
      />
    );
    const expectedData =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(`"foo","foo2"\n"bar","bar2"\n"bar","abc""\ndef"`);
    const downloadLink = await screen.findByTestId<HTMLAnchorElement>(
      "csvDownload"
    );
    expect(downloadLink.href).toEqual(expectedData);
    expect(downloadLink.download).toEqual(expect.stringMatching(/\.csv$/));
  });

  it("renders the CSV download link with a custom name", async () => {
    render(
      <Table
        data={[
          { foo: "bar", foo2: "bar2" },
          {
            foo: "bar",
            foo2: `abc"\ndef`,
            hiddenColumn: "shouldn't be downloaded",
          },
        ]}
        columns={["foo", "foo2"]}
        enableCSVDownload="my-custom-name.csv"
      />
    );
    const downloadLink = await screen.findByTestId<HTMLAnchorElement>(
      "csvDownload"
    );
    expect(downloadLink.download).toEqual("my-custom-name.csv");
  });

  it("renders booleans string columns", () => {
    type Row = {
      myColumn: boolean;
    };
    const columns: Column[] = [{ accessor: "myColumn", type: "string" }];
    const data: Row[] = [{ myColumn: true }, { myColumn: false }];
    const { getAllByRole } = render(<Table columns={columns} data={data} />);
    const cells = getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual(["true", "false"]);
  });

  describe("editable cells", () => {
    it("edits cells", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={[
            { label: "string", accessor: "string", canEdit: true },
            {
              label: "number",
              accessor: "number",
              type: "number",
              canEdit: true,
            },
            {
              label: "JSON",
              accessor: "json",
              type: "json",
              canEdit: true,
            },
            { label: "Date", accessor: "date", type: "date", canEdit: true },
            {
              label: "Datetime",
              accessor: "datetime",
              type: "datetime",
              canEdit: true,
            },
            {
              label: "Boolean",
              accessor: "bool",
              type: "boolean",
              canEdit: true,
            },
            {
              label: "Select",
              accessor: "select",
              type: "select",
              canEdit: true,
              typeOptions: {
                selectData: ["one", { label: "Two", value: "two" }, "three"],
              },
            },
          ]}
          data={[
            {
              string: "My String",
              number: 1,
              json: { foo: "bar" },
              date: new Date("2022-07-06T00:00:00.000Z"),
              datetime: new Date("2022-07-06T04:20:00.000Z"),
              bool: true,
              select: "one",
            },
          ]}
          rowActions={[
            ({ row }) => <Button onClick={() => mockCallback(row)}>b1</Button>,
          ]}
        />
      );
      const editIcons = await screen.findAllByTestId("edit-icon");
      await userEvent.click(editIcons[0]);
      const stringInput: HTMLInputElement = await screen.findByDisplayValue(
        "My String"
      );
      await userEvent.type(stringInput, "2");
      expect(stringInput.value).toBe("My String2");
      await userEvent.type(stringInput, "{tab}");
      await screen.findByText("My String2");

      await userEvent.click(editIcons[1]);
      const numInput: HTMLInputElement = await screen.findByDisplayValue(1);
      await userEvent.type(numInput, "0");
      expect(numInput.value).toBe("10");
      await userEvent.type(numInput, "{enter}");
      await screen.findByText("10");

      await userEvent.click(editIcons[2]);
      const jsonInput = await screen.findByText(`{ "foo": "bar" }`);
      await userEvent.clear(jsonInput);
      await userEvent.type(jsonInput, '{{ "foo": "baz" }');
      await screen.findByText(`{ "foo": "baz" }`);

      await userEvent.click(editIcons[3]);
      const dateInput: HTMLInputElement = await screen.findByDisplayValue(
        "Jul 06, 2022"
      );
      await userEvent.click(await screen.findByText("7"));
      expect(dateInput.value).toBe("Jul 07, 2022");
      await userEvent.type(document.body, "{enter}");
      await screen.findByText("Jul 07, 2022");

      await userEvent.click(editIcons[4]);
      const datetimeInput: HTMLInputElement = await screen.findByDisplayValue(
        formatDatetime(new Date(2022, 6, 6, 4, 20))
      );
      await userEvent.click(await screen.findByText("7"));
      await userEvent.click(await screen.findByText("+5"));
      expect(datetimeInput.value).toBe(
        formatDatetime(new Date(2022, 6, 7, 4, 25))
      );
      await userEvent.type(document.body, "{enter}");
      await screen.findByText(formatDatetime(new Date(2022, 6, 7, 4, 25)));

      const boolToggle = await screen.findByRole("checkbox", {
        name: "toggle",
      });
      expect(boolToggle).toBeChecked();
      await userEvent.click(boolToggle);
      expect(boolToggle).not.toBeChecked();

      await userEvent.click(editIcons[5]);
      // Verify that all the options are there and click an option
      await screen.findByText("one");
      const two = await screen.findByText("Two");
      await screen.findByText("three");
      await userEvent.click(two);
      // Option two has the label != value. Verify that the inputs are updated.
      await screen.findByDisplayValue("two");
      await screen.findByDisplayValue("Two");

      await userEvent.click(await screen.findByText("b1"));
      expect(mockCallback.mock.lastCall[0]).toEqual({
        bool: false,
        date: new Date("2022-07-07T00:00:00.000Z"),
        datetime: new Date("2022-07-07T04:25:00.000Z"),
        json: `{ "foo": "baz" }`,
        number: 10,
        string: "My String2",
        select: "two",
      });
    }, 25000);

    it("cancels an edit", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={[{ label: "string", accessor: "string", canEdit: true }]}
          data={[
            {
              string: "My String",
            },
          ]}
          rowActions={[
            (row) => <Button onClick={() => mockCallback(row)}>b1</Button>,
          ]}
        />
      );
      await userEvent.click(await screen.findByTestId("edit-icon"));
      const stringInput: HTMLInputElement = await screen.findByDisplayValue(
        "My String"
      );
      await userEvent.type(stringInput, "2");
      expect(stringInput.value).toBe("My String2");
      await userEvent.type(stringInput, "{escape}");
      await screen.findByText("My String");
    });

    it("editable number cells with options", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={[
            {
              label: "number",
              accessor: "number",
              type: "number",
              typeOptions: {
                numberMin: 0,
                numberMax: 100,
              },
              canEdit: true,
            },
          ]}
          data={[{ number: 1 }]}
          rowActions={[
            ({ row }) => <Button onClick={() => mockCallback(row)}>b1</Button>,
          ]}
        />
      );

      await userEvent.click(await screen.findByTestId("edit-icon"));
      let numInput: HTMLInputElement = await screen.findByDisplayValue(1);
      await userEvent.type(numInput, "0");
      expect(numInput.value).toBe("10");
      await userEvent.type(numInput, "{enter}");
      await screen.findByText("10");

      await userEvent.click(await screen.findByText("b1"));
      expect(mockCallback.mock.lastCall[0]).toEqual({
        number: 10,
      });

      // min
      await userEvent.click(await screen.findByTestId("edit-icon"));
      numInput = await screen.findByDisplayValue(10);
      await userEvent.clear(numInput);
      await userEvent.type(numInput, "-7");
      await userEvent.type(numInput, "{enter}");
      await screen.findByText("0");

      // max
      await userEvent.click(await screen.findByTestId("edit-icon"));
      numInput = await screen.findByDisplayValue(0);
      await userEvent.clear(numInput);
      await userEvent.type(numInput, "700");
      await userEvent.type(numInput, "{enter}");
      await screen.findByText("100");
    });

    it("editable boolean cells dirty state works when initial value is undefined", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={[
            {
              label: "Boolean",
              accessor: "bool",
              type: "boolean",
              canEdit: true,
            },
          ]}
          data={[
            {
              bool: undefined,
            },
          ]}
          rowActions={[
            ({ row }) => <Button onClick={() => mockCallback(row)}>b1</Button>,
          ]}
        />
      );
      const boolToggle = await screen.findByRole("checkbox", {
        name: "toggle",
      });
      expect(boolToggle).not.toBeChecked();

      // Toggle on. Cell should be dirty.
      await userEvent.click(boolToggle);
      expect(boolToggle).toBeChecked();
      await screen.findByTestId("editable-cell-dirty");

      // Toggle off. Cell should not be dirty.
      await userEvent.click(boolToggle);
      expect(boolToggle).not.toBeChecked();
      await screen.findByTestId("editable-cell");
    });
  });

  describe("custom cells", () => {
    const CustomCell = ({
      value,
      startEditing,
    }: {
      value: string;
      startEditing?: () => void;
    }) => (
      <>
        <Text disableMarkdown>{`Hi ${value}`}</Text>
        <Button onClick={startEditing}>Edit</Button>
      </>
    );

    it("it renders custom cells", async () => {
      render(
        <Table
          columns={[
            {
              accessor: "string",
              Component: CustomCell,
            },
          ]}
          data={[
            {
              string: "My String",
            },
          ]}
        />
      );
      await screen.findByText("Hi My String");
    });

    it("renders editable custom cells", async () => {
      const CustomEditableCell = ({
        defaultValue,
        finishEditing,
      }: {
        defaultValue: string;
        finishEditing: (newValue: string) => void;
      }) => {
        const [value, setValue] = useState(defaultValue);
        return (
          <>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Button onClick={() => finishEditing(value)}>Finish editing</Button>
          </>
        );
      };
      const mockCallback = jest.fn();
      render(
        <Table
          columns={[
            {
              accessor: "string",
              Component: CustomCell,
              EditComponent: CustomEditableCell,
              canEdit: true,
            },
          ]}
          data={[
            {
              string: "My String",
            },
          ]}
          rowActions={[
            ({ row }) => <Button onClick={() => mockCallback(row)}>b1</Button>,
          ]}
        />
      );

      await userEvent.click(await screen.findByText("Edit"));
      const input = await screen.findByDisplayValue("My String");
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.type(input, "Hello World");
      await userEvent.click(await screen.findByText("Finish editing"));
      await userEvent.click(await screen.findByText("b1"));
      expect(mockCallback.mock.lastCall[0]).toEqual({
        string: "Hello World",
      });
    });
  });

  describe("null-ish data", () => {
    const testCases: Record<CellType, Column | "skip"> = {
      string: { accessor: "string", type: "string" },
      number: { accessor: "number", type: "number" },
      boolean: { accessor: "boolean", type: "boolean" },
      date: { accessor: "date", type: "date" },
      datetime: { accessor: "datetime", type: "datetime" },
      select: {
        accessor: "select",
        type: "select",
        typeOptions: { selectData: ["A"] },
      },
      json: "skip",
      link: { accessor: "link", type: "link" },
    };

    Object.values(testCases).forEach((column) => {
      if (column !== "skip") {
        it(`renders ${column.type} column with null data`, () => {
          const { getByRole } = render(
            <Table columns={[column]} data={[{ [column.accessor!]: null }]} />
          );
          expect(getByRole("cell")).toHaveTextContent(/$^/);
        });

        it(`renders ${column.type} column with undefined data`, () => {
          const { getByRole } = render(
            <Table columns={[column]} data={[{}]} />
          );
          expect(getByRole("cell")).toHaveTextContent(/$^/);
        });
      }
    });

    // The JSON Code component injects styles into the DOM, which show up in the text content.
    // Workaround: test that the cell doesn't contain the string "null"
    it("renders json column with null data", () => {
      const { getByRole } = render(
        <Table
          columns={[{ accessor: "json", type: "json" }]}
          data={[{ json: null }]}
        />
      );
      expect(getByRole("cell").textContent).not.toContain("null");
    });

    it("renders json column with undefined data", () => {
      const { getByRole } = render(
        <Table<{ json?: string }>
          columns={[{ accessor: "json", type: "json" }]}
          data={[{}]}
        />
      );
      expect(getByRole("cell").textContent).not.toContain("undefined");
    });
  });

  describe("sort", () => {
    it("supports sorting", async () => {
      const user = userEvent.setup();
      type Row = {
        name: string;
      };
      const columns: Column[] = [{ label: "Name", accessor: "name" }];
      const data: Row[] = [
        { name: "D" },
        { name: "E" },
        { name: "B" },
        { name: "F" },
        { name: "A" },
        { name: "C" },
      ];
      const { getByRole, getAllByRole } = render(
        <Table columns={columns} data={data} />
      );
      await user.click(getByRole("columnheader", { name: "Name" }));
      const ascCells = getAllByRole("cell");
      expect(ascCells.map((cell) => cell.textContent)).toEqual(
        data.map((d) => d.name).sort()
      );
      await user.click(getByRole("columnheader", { name: "Name" }));
      const descCells = getAllByRole("cell");
      expect(descCells.map((cell) => cell.textContent)).toEqual(
        data
          .map((d) => d.name)
          .sort()
          .reverse()
      );
      await user.click(getByRole("columnheader", { name: "Name" }));
      const unorderedCells = getAllByRole("cell");
      expect(unorderedCells.map((cell) => cell.textContent)).toEqual(
        data.map((d) => d.name)
      );
    });

    it("supports sorting dates", async () => {
      const user = userEvent.setup();
      type Row = {
        date: Date;
      };
      const columns: Column[] = [{ label: "Date", accessor: "date" }];
      const data: Row[] = [
        { date: new Date(2022, 2) },
        { date: new Date(2022, 1) },
        { date: new Date(2022, 3) },
      ];
      const { getByRole, getAllByRole } = render(
        <Table columns={columns} data={data} />
      );
      await user.click(getByRole("columnheader", { name: "Date" }));
      const ascCells = getAllByRole("cell");
      expect(ascCells.map((cell) => cell.textContent)).toEqual([
        formatDatetime(new Date(2022, 1, 1)),
        formatDatetime(new Date(2022, 2, 1)),
        formatDatetime(new Date(2022, 3, 1)),
      ]);
      await user.click(getByRole("columnheader", { name: "Date" }));
      const descCells = getAllByRole("cell");
      expect(descCells.map((cell) => cell.textContent)).toEqual([
        formatDatetime(new Date(2022, 3, 1)),
        formatDatetime(new Date(2022, 2, 1)),
        formatDatetime(new Date(2022, 1, 1)),
      ]);
    });

    it("supports sorting bools", async () => {
      const user = userEvent.setup();
      type Row = {
        name: string;
        bool: boolean;
      };
      const columns: Column[] = [
        { label: "Name", accessor: "name" },
        { label: "Bool", accessor: "bool" },
      ];
      const data: Row[] = [
        { name: "a", bool: false },
        { name: "b", bool: true },
        { name: "c", bool: false },
      ];
      const { getByRole, getAllByRole } = render(
        <Table columns={columns} data={data} />
      );
      await user.click(getByRole("columnheader", { name: "Bool" }));
      const ascCells = getAllByRole("cell");
      expect(ascCells.map((cell) => cell.textContent)).toEqual([
        "a",
        "",
        "c",
        "",
        "b",
        "",
      ]);
      await user.click(getByRole("columnheader", { name: "Bool" }));
      const descCells = getAllByRole("cell");
      expect(descCells.map((cell) => cell.textContent)).toEqual([
        "b",
        "",
        "c",
        "",
        "a",
        "",
      ]);
    });
  });

  describe("row selection", () => {
    const TestC = (props: Partial<Omit<TableProps<Row>, "task">>) => {
      const state = useComponentState<TableState<Row>>("myTable");
      return (
        <>
          <Table<Row> columns={columns} data={data} id="myTable" {...props} />
          <div>{`SelectedRows: ${JSON.stringify(state.selectedRows)}`}</div>
          <div>{`SelectedRow: ${JSON.stringify(state.selectedRow)}`}</div>
          <Button
            onClick={() => {
              state?.clearSelection();
            }}
          >
            clear
          </Button>
        </>
      );
    };

    it("single selection", async () => {
      render(<TestC rowSelection="single" />);

      const cells = await screen.findAllByRole("cell");
      // Select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
      // De-select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(`SelectedRows: []`);
      await screen.findByText(`SelectedRow: undefined`);
      // Re-select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
      // Select row 2.
      await userEvent.click(cells[2]);
      await screen.findByText(
        `SelectedRows: [{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Orson Irwin","phone":"1-384-411-2149"}`
      );
      // Clear the selection.
      await userEvent.click(await screen.findByText("clear"));
      await screen.findByText(`SelectedRows: []`);
      await screen.findByText(`SelectedRow: undefined`);
    });

    it("single selection with inline data", async () => {
      const InlineTestC = (props: Partial<Omit<TableProps<Row>, "task">>) => {
        const state = useComponentState<TableState<Row>>("myTable");
        return (
          <>
            <Table<Row>
              {...props}
              columns={columns}
              data={[
                {
                  name: "Chester Delacruz",
                  phone: "1-845-716-5093",
                },
                {
                  name: "Orson Irwin",
                  phone: "1-384-411-2149",
                },
              ]}
              id="myTable"
            />
            <div>{`SelectedRows: ${JSON.stringify(state.selectedRows)}`}</div>
            <div>{`SelectedRow: ${JSON.stringify(state.selectedRow)}`}</div>
          </>
        );
      };

      render(<InlineTestC rowSelection="single" />);

      const cells = await screen.findAllByRole("cell");
      // Select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
    });

    it("multi selection", async () => {
      render(<TestC rowSelection="checkbox" />);

      const checkboxes = await screen.findAllByRole("checkbox");
      // Select row 1.
      await userEvent.click(checkboxes[1]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      // Select row 2.
      await userEvent.click(checkboxes[2]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"},{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
      // Select row 2 again.
      await userEvent.click(checkboxes[2]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );

      // Select row 1 again.
      await userEvent.click(checkboxes[1]);
      await screen.findByText(`SelectedRows: []`);
    });

    it("multi selection with select all", async () => {
      render(<TestC rowSelection="checkbox" selectAll />);

      const checkboxes = await screen.findAllByRole("checkbox");
      const selectAllCheckbox = checkboxes[0];
      // Select all.
      await userEvent.click(selectAllCheckbox);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"},{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
      // Deselect all.
      await userEvent.click(selectAllCheckbox);
      await screen.findByText(`SelectedRows: []`);
      // Select row 1.
      await userEvent.click(checkboxes[1]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      // Checkbox is indeterminate. Clicking again should select all.
      await userEvent.click(selectAllCheckbox);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"},{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
    });

    it("works with default selected rows", async () => {
      const { rerender } = render(
        <TestC
          rowSelection="single"
          isDefaultSelectedRow={(row, idx) => idx === 1}
        />
      );

      // Check row 2 selected by default.
      await screen.findByText(
        `SelectedRows: [{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Orson Irwin","phone":"1-384-411-2149"}`
      );

      const cells = await screen.findAllByRole("cell");
      // Select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
      // De-select row 1.
      await userEvent.click(cells[0]);
      await screen.findByText(`SelectedRows: []`);
      await screen.findByText(`SelectedRow: undefined`);

      // Rerender and check that selection doesn't change.
      rerender(
        <TestC
          rowSelection="single"
          isDefaultSelectedRow={(row, idx) => idx === 0}
        />
      );
      await screen.findByText(`SelectedRows: []`);
      await screen.findByText(`SelectedRow: undefined`);
    });

    it("default selected rows works with task", async () => {
      const TestCWithTask = <TRowData extends object, TOutput>(
        props: Partial<
          Omit<TableProps<TRowData, { foo: string }, TOutput>, "data">
        >
      ) => {
        const state = useComponentState<TableState<Row>>("myTable");
        return (
          <>
            <Table<TRowData, { foo: string }, TOutput>
              id="myTable"
              {...props}
              task={{ slug: "myTask", params: { foo: "bar" } }}
              isDefaultSelectedRow={(row, idx) => idx === 0}
            />
            <div>{`SelectedRows: ${JSON.stringify(state.selectedRows)}`}</div>
            <div>{`SelectedRow: ${JSON.stringify(state.selectedRow)}`}</div>
          </>
        );
      };
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });
      render(<TestCWithTask />);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
    });

    it("only selects single row for single row selection", async () => {
      render(
        <TestC
          rowSelection="single"
          isDefaultSelectedRow={(row, idx) => true}
        />
      );

      // Check that only row 1 is selected.
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
    });

    it("works with controlled selected rows", async () => {
      const mockCallback = jest.fn();
      const { rerender } = render(
        <TestC
          rowSelection="single"
          isSelectedRow={(row, idx) => idx === 0}
          onToggleRow={mockCallback}
        />
      );

      // Check row 1 selected by default.
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
      // Make sure that onToggleRow isn't called yet.
      expect(mockCallback.mock.calls).toHaveLength(0);

      const cells = await screen.findAllByRole("cell");
      // De-select row 1, make sure that it doesn't work.
      await userEvent.click(cells[0]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Chester Delacruz","phone":"1-845-716-5093"}`
      );
      // Make sure that onToggleRow triggers though, even if row 1 doesn't get de-selected.
      expect(mockCallback.mock.lastCall).toEqual([
        { name: "Chester Delacruz", phone: "1-845-716-5093" },
        0,
      ]);

      rerender(
        <TestC rowSelection="single" isSelectedRow={(row, idx) => idx === 1} />
      );
      // Check row 2 is now selected.
      await screen.findByText(
        `SelectedRows: [{"name":"Orson Irwin","phone":"1-384-411-2149"}]`
      );
      await screen.findByText(
        `SelectedRow: {"name":"Orson Irwin","phone":"1-384-411-2149"}`
      );
    });

    it("selection is stable with custom row id", async () => {
      const TestC = ({ d }: { d: typeof data }) => {
        const state = useComponentState<TableState<Row>>("myTable");
        return (
          <>
            <Table<Row>
              rowSelection="checkbox"
              columns={columns}
              data={d}
              id="myTable"
              rowID="name"
            />
            <div>{`SelectedRows: ${JSON.stringify(state.selectedRows)}`}</div>
          </>
        );
      };

      const { rerender } = render(<TestC d={data} />);

      let checkboxes = await screen.findAllByRole("checkbox");
      // Select row 1.
      await userEvent.click(checkboxes[1]);
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      expect(checkboxes[1]).toBeChecked();

      // Rerender with data in reverse order.
      rerender(<TestC d={data.slice().reverse()} />);

      checkboxes = await screen.findAllByRole("checkbox");
      // The same row should be checked in a different position.
      await screen.findByText(
        `SelectedRows: [{"name":"Chester Delacruz","phone":"1-845-716-5093"}]`
      );
      expect(checkboxes[2]).toBeChecked();
    });
  });

  describe("row actions", () => {
    it("hard coded row actions", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={columns}
          data={data}
          rowActions={[
            ({ row }) => <Button onClick={() => mockCallback(row)}>b1</Button>,
            ({ row }) => <Button onClick={() => mockCallback(row)}>b2</Button>,
          ]}
        />
      );

      const b1s = await screen.findAllByText("b1");
      await userEvent.click(b1s[0]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
      await userEvent.click(b1s[1]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[1]);

      mockCallback.mockClear();

      const b2s = await screen.findAllByText("b2");
      await userEvent.click(b2s[0]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
      await userEvent.click(b2s[1]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[1]);
    });

    it("basic row actions", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={columns}
          data={data}
          rowActions={[
            { label: "b1", onClick: (row) => mockCallback(row) },
            { label: "b2", onClick: (row) => mockCallback(row) },
          ]}
        />
      );

      const b1s = await screen.findAllByText("b1");
      await userEvent.click(b1s[0]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
      await userEvent.click(b1s[1]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[1]);

      mockCallback.mockClear();

      const b2s = await screen.findAllByText("b2");
      await userEvent.click(b2s[0]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
      await userEvent.click(b2s[1]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[1]);
    });

    it("row actions menu", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={columns}
          data={data}
          rowActionsMenu={[
            { label: "b1", onClick: (row) => mockCallback(row) },
            { label: "b2", onClick: (row) => mockCallback(row) },
          ]}
        />
      );

      const menus = await screen.findAllByRole("button");
      await userEvent.click(menus[0]);
      const button = await screen.findByText("b1");
      await userEvent.click(button);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
    });

    it("single non-array row action", async () => {
      const mockCallback = jest.fn();
      render(
        <Table
          columns={columns}
          data={data}
          rowActions={({ row }) => (
            <Button onClick={() => mockCallback(row)}>b1</Button>
          )}
        />
      );

      const b1s = await screen.findAllByText("b1");
      await userEvent.click(b1s[0]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[0]);
      await userEvent.click(b1s[1]);
      expect(mockCallback.mock.lastCall[0]).toEqual(data[1]);
    });

    it("calls airplane task", async () => {
      const mockCallback = jest.fn();
      executeTaskSuccess({
        output: "output",
        expectedParamValues: { ...data[0], foo: "bar" },
      });
      render(
        <Table
          columns={columns}
          data={data}
          rowActions={[
            { slug: "foo", params: { foo: "bar" }, onSuccess: mockCallback },
          ]}
        />
      );

      await screen.findAllByText("foo");
      const buttons = await screen.findAllByRole("button");
      await waitFor(() => expect(buttons[0]).not.toBeDisabled());
      await userEvent.click(buttons[0]);
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      expect(mockCallback.mock.lastCall[0]).toEqual("output");
    });

    it("calls airplane task from menu", async () => {
      const mockCallback = jest.fn();
      executeTaskSuccess({
        output: "output",
        expectedParamValues: { ...data[0], foo: "bar" },
      });
      render(
        <Table
          columns={columns}
          data={data}
          rowActionsMenu={[
            { slug: "foo", params: { foo: "bar" }, onSuccess: mockCallback },
          ]}
        />
      );

      const menus = await screen.findAllByRole("button");
      await userEvent.click(menus[0]);
      const buttons = await screen.findAllByText("foo");
      await userEvent.click(buttons[0]);
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      expect(mockCallback.mock.lastCall[0]).toEqual("output");
    });

    it("calls airplane task with transformation and custom label", async () => {
      const mockCallback = jest.fn();
      executeTaskSuccess({
        output: "output",
        expectedParamValues: { name: data[0].name.toUpperCase() },
      });

      render(
        <QueryProvider>
          <Table
            columns={columns}
            data={data}
            rowActions={[
              {
                label: "Do a thing",
                slug: "foo",
                onSuccess: mockCallback,
                getParamsFromRow: (r) => ({ name: r.name.toUpperCase() }),
              },
            ]}
          />
        </QueryProvider>
      );

      await screen.findAllByText("Do a thing");
      const buttons = await screen.findAllByRole("button");
      await waitFor(() => expect(buttons[0]).not.toBeDisabled());
      await userEvent.click(buttons[0]);
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      expect(mockCallback.mock.lastCall[0]).toEqual("output");
    });

    it("get row action result", async () => {
      const TestC = () => {
        const tableState = useComponentState("table");
        return (
          <>
            <Table
              columns={columns}
              data={data}
              id="table"
              rowActions={[
                {
                  label: "Click",
                  slug: "foo",
                },
              ]}
            />
            <div>Output: {tableState?.rowActionResult?.output}</div>
          </>
        );
      };

      render(<TestC />);

      executeTaskSuccess({
        output: "output",
        expectedParamValues: data[0],
      });

      await screen.findAllByText("Click");
      const buttons = await screen.findAllByRole("button");
      await waitFor(() => expect(buttons[0]).not.toBeDisabled());
      await userEvent.click(buttons[0]);
      await screen.findByText("Output: output");
    });

    it("calls airplane task with confirmation", async () => {
      const mockCallback = jest.fn();
      executeTaskSuccess({
        output: "output",
        expectedParamValues: { ...data[0] },
      });
      render(
        <Table
          columns={columns}
          data={data}
          rowActions={[{ slug: "foo", confirm: true, onSuccess: mockCallback }]}
        />
      );

      await screen.findAllByText("foo");
      const buttons = await screen.findAllByRole("button");
      await waitFor(() => expect(buttons[0]).not.toBeDisabled());
      await userEvent.click(buttons[0]);

      const confirm = await screen.findByText("Run");
      await screen.findByText("Cancel");
      await userEvent.click(confirm);

      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      expect(mockCallback.mock.lastCall[0]).toEqual("output");
    }, 10000);
  });

  describe("columns", () => {
    it("infers columns without explicit columns props", async () => {
      const { getAllByRole } = render(<Table data={data} />);
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      expect(headers[0].textContent).toBe("name");
      expect(headers[1].textContent).toBe("phone");
    });

    it("infers columns from all rows", async () => {
      const { getAllByRole } = render(
        <Table data={[...data, { name: "Jane Doe", address: "123 Main St" }]} />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length + 1);
      expect(headers[0].textContent).toBe("name");
      expect(headers[1].textContent).toBe("phone");
      expect(headers[2].textContent).toBe("address");
    });

    it("overrides inferred columns with explicit columns", async () => {
      const explicitColumns: Column[] = [
        { label: "Phone Number", accessor: "phone" },
      ];
      const { getAllByRole } = render(
        <Table data={data} columns={explicitColumns} />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(explicitColumns.length);
      expect(headers[0].textContent).toBe("Phone Number");
    });

    it("transforms columns after override", async () => {
      const explicitColumns: Column[] = [
        { label: "Phone Number", accessor: "phone" },
      ];

      const { getAllByRole } = render(
        <Table
          data={data}
          columns={explicitColumns}
          columnsTransform={(cols) => {
            cols = cols.map((c) => ({
              ...c,
              label: (c.label as string).toLowerCase().replace(" ", "_"),
            }));
            return cols;
          }}
        />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(explicitColumns.length);
      expect(headers[0].textContent).toBe("phone_number");
    });

    it("can hide columns via transform", async () => {
      const { getAllByRole } = render(
        <Table
          data={data}
          columnsTransform={(cols) =>
            cols.filter((col) => !["phone"].includes(col.accessor))
          }
        />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length - 1);
      expect(headers[0].textContent).toBe("name");
    });

    it("can filter to shown columns via transform", async () => {
      const { getAllByRole } = render(
        <Table
          data={data}
          columnsTransform={(cols) =>
            cols.filter((col) => ["phone"].includes(col.accessor))
          }
        />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(1);
      expect(headers[0].textContent).toBe("phone");
    });

    it("hides columns", async () => {
      const { getAllByRole } = render(
        <Table data={data} hiddenColumns={["phone"]} />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length - 1);
      expect(headers[0].textContent).toBe("name");
    });

    it("sets label to accessor by default", async () => {
      const { getAllByRole } = render(
        <Table
          data={data}
          columns={[{ accessor: "name" }, { accessor: "phone" }]}
        />
      );
      const headers = getAllByRole("columnheader");
      expect(headers).toHaveLength(2);
      expect(headers[0].textContent).toBe("name");
      expect(headers[1].textContent).toBe("phone");
    });

    it("handles accessors with periods in them", () => {
      type Row = {
        "my.name": string;
      };
      const columns: Column[] = [{ label: "My name", accessor: "my.name" }];
      const data: Row[] = [{ "my.name": "a" }];
      const { getByRole } = render(<Table columns={columns} data={data} />);
      const cell = getByRole("cell");
      expect(cell.textContent).toEqual("a");
    });
  });

  describe("task query", () => {
    const TestC = <TRowData extends object, TOutput>(
      props: Partial<TableWithTaskProps<TRowData, { foo: string }, TOutput>>
    ) => {
      return (
        <>
          <Table<TRowData, { foo: string }, TOutput>
            id="myTable"
            {...props}
            task={{ slug: "myTask", params: { foo: "bar" } }}
          />
        </>
      );
    };

    it("data and columns from query", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      await screen.findByText(data[0].name);
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      expect(headers[0].textContent).toBe("name");
      expect(headers[1].textContent).toBe("phone");
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
      expect(cells[0].textContent).toBe(data[0].name);
      expect(cells[1].textContent).toBe(data[0].phone);
      expect(cells[2].textContent).toBe(data[1].name);
      expect(cells[3].textContent).toBe(data[1].phone);
    });

    it("query output is an object", async () => {
      executeTaskSuccess({
        output: { Q1: data },
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      await screen.findByText(data[0].name);
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
    });

    it("output transform unwraps before applying when Q1", async () => {
      executeTaskSuccess({
        output: { Q1: data },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC<Row, Row[]>
          outputTransform={(data) =>
            data.map((d) => ({ ...d, name: d.name.toUpperCase() }))
          }
        />
      );
      await screen.findByText(data[0].name.toUpperCase());
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
      expect(cells[0].textContent).toBe(data[0].name.toUpperCase());
      expect(cells[1].textContent).toBe(data[0].phone);
      expect(cells[2].textContent).toBe(data[1].name.toUpperCase());
      expect(cells[3].textContent).toBe(data[1].phone);
    });

    it("output transform doesn't unwrap when not Q1", async () => {
      executeTaskSuccess({
        output: { data },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC<Row, { data: Row[] }>
          outputTransform={({ data }) =>
            data.map((d) => ({ ...d, name: d.name.toUpperCase() }))
          }
        />
      );
      await screen.findByText(data[0].name.toUpperCase());
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
      expect(cells[0].textContent).toBe(data[0].name.toUpperCase());
      expect(cells[1].textContent).toBe(data[0].phone);
      expect(cells[2].textContent).toBe(data[1].name.toUpperCase());
      expect(cells[3].textContent).toBe(data[1].phone);
    });

    it("query is an airplane function", async () => {
      const myTask = airplane.task(
        {
          slug: "task",
          parameters: {
            foo: {
              type: "shorttext",
            },
          },
        },
        (params) => {
          return "";
        }
      );
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      const TestC = () => {
        return (
          <Table id="myTable" task={{ fn: myTask, params: { foo: "bar" } }} />
        );
      };

      render(<TestC />);

      await screen.findByText(data[0].name);
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      expect(headers[0].textContent).toBe("name");
      expect(headers[1].textContent).toBe("phone");
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
      expect(cells[0].textContent).toBe(data[0].name);
      expect(cells[1].textContent).toBe(data[0].phone);
      expect(cells[2].textContent).toBe(data[1].name);
      expect(cells[3].textContent).toBe(data[1].phone);
    });

    it("transforms data", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC<Row, Row[]>
          outputTransform={(data) =>
            data.map((d) => ({ ...d, name: d.name.toUpperCase() }))
          }
        />
      );

      await screen.findByText(data[0].name.toUpperCase());
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(data.length * columns.length);
      expect(cells[0].textContent).toBe(data[0].name.toUpperCase());
      expect(cells[1].textContent).toBe(data[0].phone);
      expect(cells[2].textContent).toBe(data[1].name.toUpperCase());
      expect(cells[3].textContent).toBe(data[1].phone);
    });

    it("transforms columns", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC<Row, Row[]>
          columnsTransform={(cols) => {
            cols = cols.map((c) => ({
              ...c,
              label: (c.label as string).toUpperCase(),
            }));
            return cols;
          }}
        />
      );

      await screen.findByText(data[0].name);
      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(columns.length);
      expect(headers[0].textContent).toBe("NAME");
      expect(headers[1].textContent).toBe("PHONE");
    });

    it("merges in columns", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC<Row, Row[]> columns={[{ accessor: "name", label: "NAME" }]} />
      );

      const headers = await screen.findAllByRole("columnheader");
      expect(headers[0].textContent).toBe("NAME");
    });

    it("no data", async () => {
      executeTaskSuccess({
        output: [],
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC noData="Nothin here" />);

      await screen.findByText("Nothin here");
    });

    it("loading state", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      const headers = await screen.findAllByRole("columnheader");
      expect(headers).toHaveLength(4);
      const cells = await screen.findAllByRole("cell");
      expect(cells).toHaveLength(4 * 10);
    });

    describeExpectError(() => {
      it("query fails", async () => {
        executeTaskFail();

        rawRender(
          <ViewProvider>
            <TestC />
          </ViewProvider>
        );

        await screen.findByText(getRunErrorMessage("myTask"));
      });

      it("shows error modal with latest run when component errors", async () => {
        executeTaskSuccess({
          output: data,
          expectedParamValues: { foo: "bar" },
        });

        render(
          <TestC<Row, Row[]>
            outputTransform={(data) =>
              // @ts-expect-error
              data.Q7.map((d) => ({ ...d, name: "test" }))
            }
          />
        );
        await screen.findAllByRole("dialog");
        await screen.findByText("Something went wrong in the Table component");
        await screen.findByText("Stack trace");
        await screen.findByText("Component stack trace");
        await screen.findByText("Latest run");
      });
    });
  });

  describe("filtering", () => {
    it("filters", async () => {
      const { getAllByRole, findByRole, findByText, queryByText } = render(
        <Table columns={columns} data={data} />
      );
      expect(getAllByRole("cell")).toHaveLength(data.length * columns.length);
      const filter = await findByRole("textbox");

      await userEvent.type(filter, "Delacruz");
      await waitFor(() => expect(queryByText(data[1].name)).toBeNull());
      await findByText(data[0].name);
      expect(getAllByRole("cell")).toHaveLength(columns.length);
    });

    it("filters when on second page", async () => {
      const { findByRole, findByText, queryByText } = render(
        <Table columns={columns} data={data} defaultPageSize={1} />
      );
      // Go to second page.
      const next = await screen.findByRole("button", { name: "next" });
      await userEvent.click(next);
      await findByText(data[1].name);
      expect(queryByText(data[0].name)).toBeNull();

      // Filter for data that is on the first page.
      const filter = await findByRole("textbox");
      await userEvent.type(filter, "Delacruz");
      await waitFor(() => expect(queryByText(data[1].name)).toBeNull());
      await findByText(data[0].name);
    });
  });
});
