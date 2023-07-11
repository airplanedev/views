import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Button } from "components/button/Button";
import { Text } from "components/text/Text";
import { DatePickerState, useComponentState } from "state";
import { render, screen } from "test-utils/react";

import { DateTimePicker, formatDatetime } from "./DateTimePicker";

describe("DateTimePicker", () => {
  const d1 = new Date(2022, 1, 1, 5, 30);
  const d2 = new Date(2022, 2, 1, 6, 42);

  it("works as a controlled component", async () => {
    const TestC = () => {
      const [value, setValue] = useState<Date | undefined>(d1);
      return (
        <>
          <DateTimePicker value={value} onChange={setValue} />
        </>
      );
    };
    render(<TestC />);

    const input = await screen.findByDisplayValue(
      formatDatetime(new Date(2022, 1, 1, 5, 30)),
    );
    await userEvent.click(input);
    await userEvent.click(await screen.findByText("17"));
    await screen.findByDisplayValue(
      formatDatetime(new Date(2022, 1, 17, 5, 30)),
    );
  });

  it("works as an uncontrolled component", async () => {
    const TestC = () => {
      const inputState = useComponentState<DatePickerState>("myDatePicker");
      return (
        <>
          <DateTimePicker id="myDatePicker" defaultValue={d1} />
          <Text>{inputState.value?.toISOString() ?? "None"}</Text>
          <Text>{String(inputState.disabled)}</Text>
        </>
      );
    };
    render(<TestC />);

    await screen.findAllByText("2022-02-01T05:30:00.000Z");
    await screen.findAllByText("false");
    const input = await screen.findByDisplayValue(
      formatDatetime(new Date(2022, 1, 1, 5, 30)),
    );
    expect(input).not.toBeDisabled();

    // Change value using UI.
    await userEvent.click(input);
    await userEvent.click(await screen.findByText("17"));
    await screen.findAllByText("2022-02-17T05:30:00.000Z");
    expect(input).toHaveValue(formatDatetime(new Date(2022, 1, 17, 5, 30)));
    await userEvent.click(await screen.findByText("AM"));
    await screen.findAllByText("2022-02-17T17:30:00.000Z");
    expect(input).toHaveValue(formatDatetime(new Date(2022, 1, 17, 17, 30)));
  });

  it("works as an uncontrolled component with component state", async () => {
    const TestC = () => {
      const inputState = useComponentState<DatePickerState>("myDatePicker");
      return (
        <>
          <DateTimePicker id="myDatePicker" defaultValue={d1} />
          <Button
            onClick={() => {
              inputState.setValue(d2);
              inputState.setDisabled(true);
            }}
          >
            button1
          </Button>
          <Button onClick={() => inputState.setValue(undefined)}>
            button2
          </Button>
          <Text>{inputState.value?.toISOString() ?? "None"}</Text>
          <Text>{String(inputState.disabled)}</Text>
        </>
      );
    };
    render(<TestC />);

    await screen.findAllByText("2022-02-01T05:30:00.000Z");
    await screen.findAllByText("false");
    const input = await screen.findByDisplayValue(
      formatDatetime(new Date(2022, 1, 1, 5, 30)),
    );
    expect(input).not.toBeDisabled();

    // Change value using component state.
    await userEvent.click(await screen.findByText("button2"));
    expect(input).toHaveValue("");
    await userEvent.click(await screen.findByText("button1"));
    await screen.findAllByText("2022-03-01T06:42:00.000Z");
    await screen.findAllByText("true");
    expect(input).toHaveValue(formatDatetime(new Date(2022, 2, 1, 6, 42)));
    expect(input).toBeDisabled();
  });
});

describe("formatDatetime", () => {
  [
    { date: new Date(2022, 0, 1), expected: "Jan 1, 2022 12:00 AM" },
    { date: new Date(2022, 11, 15, 12), expected: "Dec 15, 2022 12:00 PM" },
    { date: new Date(2022, 1, 1, 5, 30), expected: "Feb 1, 2022 5:30 AM" },
    { date: new Date(2022, 11, 15, 16, 22), expected: "Dec 15, 2022 4:22 PM" },
  ].forEach(({ date, expected }) => {
    it(`formats ${date} as ${expected}`, () => {
      expect(formatDatetime(date)).toBe(expected);
    });
  });
});
