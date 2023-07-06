import userEvent from "@testing-library/user-event";
import airplane from "airplane";
import { useState } from "react";

import { getRunErrorMessage } from "components/errorBoundary/ComponentErrorState";
import { ViewProvider } from "provider";
import { RadioGroupState, useComponentState } from "state";
import { describeExpectError } from "test-utils/describeExpectError";
import { rawRender, render, screen, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

import { RadioGroup } from "./RadioGroup";
import { RadioGroupPropsWithTask } from "./RadioGroup.types";

describe("RadioGroup", () => {
  const data = ["hi", "bye"];

  it("works as a controlled component", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string | undefined>("hi");
      return (
        <>
          <RadioGroup
            data={data}
            value={value}
            onChange={setValue}
            label="radioGroup"
          />
          <button onClick={() => setValue("bye")}>button</button>
        </>
      );
    };
    render(<TestC />);

    const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
    const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
    expect(hiInput.checked).toBe(true);
    expect(byeInput.checked).toBe(false);

    await userEvent.click(await screen.findByRole("button"));

    expect(hiInput.checked).toBe(false);
    expect(byeInput.checked).toBe(true);
  });

  it("works as an uncontrolled component", async () => {
    const TestC = () => {
      const inputState = useComponentState<RadioGroupState>("myRadioGroup");
      return (
        <>
          <RadioGroup
            data={data}
            id="myRadioGroup"
            defaultValue="hi"
            label="selectMe"
          />
          <div>{`Value: ${inputState.value}`}</div>
          <div>{`Disabled: ${inputState.disabled}`}</div>
          <button
            onClick={() => {
              inputState.setValue("bye");
              inputState.setDisabled(true);
            }}
          >
            button
          </button>
        </>
      );
    };
    render(<TestC />);

    const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
    const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
    expect(hiInput.checked).toBe(true);
    expect(byeInput.checked).toBe(false);
    expect(hiInput).not.toBeDisabled();
    expect(byeInput).not.toBeDisabled();
    await screen.findByText("Value: hi");
    await screen.findByText("Disabled: false");

    await userEvent.click(byeInput);
    expect(hiInput.checked).toBe(false);
    expect(byeInput.checked).toBe(true);
    expect(hiInput).not.toBeDisabled();
    expect(byeInput).not.toBeDisabled();
    await screen.findByText("Value: bye");
    await screen.findByText("Disabled: false");

    await userEvent.click(await screen.findByRole("button"));

    expect(hiInput.checked).toBe(false);
    expect(byeInput.checked).toBe(true);
    expect(hiInput).toBeDisabled();
    expect(byeInput).toBeDisabled();
    await screen.findByText("Value: bye");
    await screen.findByText("Disabled: true");
  });

  describe("with query", () => {
    const componentStateText = (value?: string | null) =>
      `Component state value: ${value}`;

    const TestC = ({
      outputTransform,
      defaultValue = "hi",
    }: {
      outputTransform?: RadioGroupPropsWithTask["outputTransform"];
      defaultValue?: RadioGroupPropsWithTask["defaultValue"];
    }) => {
      const inputState = useComponentState<RadioGroupState>("myRadioGroup");
      return (
        <>
          <RadioGroup
            task={{ slug: "myTask", params: { foo: "bar" } }}
            id="myRadioGroup"
            defaultValue={defaultValue}
            outputTransform={outputTransform}
            label="radioGroup"
          />
          <div>{componentStateText(inputState.value)}</div>
        </>
      );
    };

    it("query returns array", async () => {
      executeTaskSuccess({
        output: ["hi", "bye"],
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });

      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });

    it("query returns object", async () => {
      executeTaskSuccess({
        output: [
          { value: "hi", label: "hi" },
          { value: "bye", label: "bye" },
        ],
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });

      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });

    it("query returns object with transformer", async () => {
      executeTaskSuccess({
        output: [
          { value: "hi", label: "hi" },
          { value: "bye", label: "bye" },
        ],
        expectedParamValues: { foo: "bar" },
      });

      render(
        <TestC
          outputTransform={(output: { value: string; label: string }[]) =>
            output.map((c) => ({
              value: c.value.toUpperCase(),
              label: c.label.toUpperCase(),
            }))
          }
          defaultValue="HI"
        />,
      );

      const hiInput = await screen.findByLabelText<HTMLInputElement>("HI");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("BYE");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });
      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
      expect(screen.getByText(componentStateText("BYE"))).toBeInTheDocument();
    });

    it("dataTransform receives object output", async () => {
      const expectedOutput = {
        Q1: [{ value: "hi", label: "hi" }],
      };
      executeTaskSuccess({
        output: expectedOutput,
        expectedParamValues: { foo: "bar" },
      });

      const TestC = () => {
        return (
          <RadioGroup<
            { foo: string },
            { Q1: { value: string; label: string }[] }
          >
            task={{ slug: "myTask", params: { foo: "bar" } }}
            outputTransform={(output) => {
              expect(output).toEqual(expectedOutput);
              return output.Q1;
            }}
            id="myRadioGroup"
            label="radioGroup"
          />
        );
      };

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );
    });

    it("query with just slug", async () => {
      const TestC = () => {
        return (
          <>
            <RadioGroup
              task="myTask"
              id="myRadioGroup"
              defaultValue="hi"
              label="radioGroup"
            />
          </>
        );
      };

      executeTaskSuccess({
        output: [
          { value: "hi", label: "hi" },
          { value: "bye", label: "bye" },
        ],
        expectedParamValues: {},
      });

      render(<TestC />);

      const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });
      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
    });

    it("unwraps nested string data", async () => {
      executeTaskSuccess({
        output: { Q1: ["hi", "bye"] },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );

      const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });
      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });
    it("unwraps nested object data", async () => {
      executeTaskSuccess({
        output: {
          Q1: [
            { value: "hi", label: "Hi" },
            { value: "bye", label: "Bye" },
          ],
        },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );

      const hiInput = await screen.findByLabelText<HTMLInputElement>("Hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("Bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });
      await userEvent.click(byeInput);
      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
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
        },
      );

      const TestC = () => {
        const inputState = useComponentState<RadioGroupState>("myRadioGroup");
        return (
          <>
            <RadioGroup
              task={{ fn: myTask, params: { foo: "bar" } }}
              id="myRadioGroup"
              defaultValue="hi"
              label="radioGroup"
            />
            <button
              onClick={() => {
                inputState.setValue("bye");
              }}
            >
              button
            </button>
          </>
        );
      };

      executeTaskSuccess({
        output: ["hi", "bye"],
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC />);

      const hiInput = await screen.findByLabelText<HTMLInputElement>("hi");
      const byeInput = await screen.findByLabelText<HTMLInputElement>("bye");
      await waitFor(() => {
        expect(hiInput.checked).toBe(true);
      });

      await userEvent.click(await screen.findByRole("button"));

      expect(hiInput.checked).toBe(false);
      expect(byeInput.checked).toBe(true);
    });

    describeExpectError(() => {
      it("query errors", async () => {
        executeTaskFail();

        rawRender(
          <ViewProvider>
            <TestC />
          </ViewProvider>,
        );

        await screen.findByText(getRunErrorMessage("myTask"));
      });

      it("shows error modal with latest run when component errors", async () => {
        executeTaskSuccess({
          output: [
            { value: "hi", label: "hi" },
            { value: "bye", label: "bye" },
          ],
          expectedParamValues: { foo: "bar" },
        });

        render(
          <TestC
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            outputTransform={(data) => data.Q7.map((d: any) => d.toUpperCase())}
            defaultValue="HI"
          />,
        );

        render(<TestC />);
        await screen.findAllByRole("dialog");
        await screen.findByText(
          "Something went wrong in the RadioGroup component",
        );
        await screen.findByText("Stack trace");
        await screen.findByText("Component stack trace");
        await screen.findByText("Latest run");
      });
    });
  });
});
