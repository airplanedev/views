import userEvent from "@testing-library/user-event";
import airplane from "airplane";
import { useState } from "react";

import { getRunErrorMessage } from "components/errorBoundary/ComponentErrorState";
import { ViewProvider } from "provider";
import { SelectState, useComponentState } from "state";
import { describeExpectError } from "test-utils/describeExpectError";
import { rawRender, render, screen, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

import { Select } from "./Select";
import { SelectPropsWithTask } from "./Select.types";

describe("Select", () => {
  const data = ["hi", "bye"];

  it("works as a controlled component", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string | number | undefined>("hi");
      return (
        <>
          <Select
            data={data}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue("bye")}>button</button>
        </>
      );
    };
    render(<TestC />);

    const selectInput = await screen.findByLabelText<HTMLInputElement>(
      "selectMe",
    );
    expect(selectInput.value).toBe("hi");

    await userEvent.click(await screen.findByRole("button"));

    expect(selectInput.value).toBe("bye");
  });

  it("works as a controlled component with numbers", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string | number | undefined>(9);
      return (
        <>
          <Select
            data={[0, 8, 9]}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button data-testid="b1" onClick={() => setValue(8)}>
            button
          </button>
          <button data-testid="b2" onClick={() => setValue(0)}>
            button
          </button>
        </>
      );
    };
    render(<TestC />);

    const selectInput = await screen.findByLabelText<HTMLInputElement>(
      "selectMe",
    );
    expect(selectInput.value).toBe("9");

    await userEvent.click(await screen.findByTestId("b1"));
    expect(selectInput.value).toBe("8");

    await userEvent.click(await screen.findByTestId("b2"));
    expect(selectInput.value).toBe("0");
  });

  it("works as a controlled component with mixed input", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string | number | undefined>(9);
      return (
        <>
          <Select
            data={["testing", 9]}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue("testing")}>button</button>
        </>
      );
    };
    render(<TestC />);

    const selectInput = await screen.findByLabelText<HTMLInputElement>(
      "selectMe",
    );
    expect(selectInput.value).toBe("9");

    await userEvent.click(await screen.findByRole("button"));
    expect(selectInput.value).toBe("testing");
  });

  it("works as an uncontrolled component", async () => {
    const TestC = () => {
      const inputState = useComponentState<SelectState>("mySelect");
      return (
        <>
          <Select
            data={data}
            id="mySelect"
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

    const selectInput = await screen.findByLabelText<HTMLInputElement>(
      "selectMe",
    );
    expect(selectInput).toHaveValue("hi");
    expect(selectInput).not.toBeDisabled();
    await screen.findByText("Value: hi");
    await screen.findByText("Disabled: false");

    await userEvent.click(selectInput);
    await userEvent.click(await screen.findByText("bye"));
    expect(selectInput).toHaveValue("bye");
    expect(selectInput).not.toBeDisabled();
    await screen.findByText("Value: bye");
    await screen.findByText("Disabled: false");

    await userEvent.click(await screen.findByRole("button"));

    expect(selectInput).toHaveValue("bye");
    expect(selectInput).toBeDisabled();
    await screen.findByText("Value: bye");
    await screen.findByText("Disabled: true");
  });

  describe("with query", () => {
    const componentStateText = (value?: string | number | undefined) =>
      `Component state value: ${value}`;

    const TestC = ({
      outputTransform,
      defaultValue = "hi",
    }: {
      outputTransform?: SelectPropsWithTask["outputTransform"];
      defaultValue?: SelectPropsWithTask["defaultValue"];
    }) => {
      const inputState = useComponentState<SelectState>("mySelect");
      return (
        <>
          <Select
            task={{ slug: "myTask", params: { foo: "bar" } }}
            id="mySelect"
            defaultValue={defaultValue}
            outputTransform={outputTransform}
            label="selectMe"
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });

      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });

      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });

    it("query returns object with number values", async () => {
      executeTaskSuccess({
        output: [
          { value: 8, label: "hi" },
          { value: 9, label: "bye" },
        ],
        expectedParamValues: { foo: "bar" },
      });

      render(<TestC defaultValue={8} />);

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );

      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });

      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
      expect(screen.getByText(componentStateText("9"))).toBeInTheDocument();
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("HI");
      });
      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("BYE");
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
          <Select<{ foo: string }, { Q1: { value: string; label: string }[] }>
            task={{ slug: "myTask", params: { foo: "bar" } }}
            outputTransform={(output) => {
              expect(output).toEqual(expectedOutput);
              return output.Q1;
            }}
            id="mySelect"
            label="selectMe"
          />
        );
      };

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );
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
    });

    it("query with just slug", async () => {
      const TestC = () => {
        return (
          <>
            <Select
              task="myTask"
              id="mySelect"
              defaultValue="hi"
              label="selectMe"
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });
      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });

    it("unwraps data with the same key (one column)", async () => {
      executeTaskSuccess({
        output: { Q1: [{ name: "hi" }, { name: "bye" }] },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });
      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
      expect(screen.getByText(componentStateText("bye"))).toBeInTheDocument();
    });

    it("unwraps data with the one row", async () => {
      executeTaskSuccess({
        output: { Q1: [{ unknown1: "hi", unknown2: "bye" }] },
        expectedParamValues: { foo: "bar" },
      });

      render(
        <ViewProvider>
          <TestC />
        </ViewProvider>,
      );

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });
      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("bye");
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("Hi");
      });
      await userEvent.click(await screen.findByRole("searchbox"));
      await userEvent.click(screen.queryAllByRole("option")[1]);
      expect(selectInput).toHaveValue("Bye");
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
        const inputState = useComponentState<SelectState>("mySelect");
        return (
          <>
            <Select
              task={{ fn: myTask, params: { foo: "bar" } }}
              id="mySelect"
              defaultValue="hi"
              label="selectMe"
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

      const selectInput = await screen.findByLabelText<HTMLInputElement>(
        "selectMe",
      );
      await waitFor(() => {
        expect(selectInput).toHaveValue("hi");
      });

      await userEvent.click(await screen.findByRole("button"));

      expect(selectInput).toHaveValue("bye");
    });
  });

  describeExpectError(() => {
    it("shows error modal with latest run when component errors", async () => {
      const TestC = () => {
        return (
          <Select
            task="myTask"
            id="mySelect"
            defaultValue="hi"
            label="selectMe"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            outputTransform={(data) => data.Q7.map((d: any) => d.toUpperCase())}
          />
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
      await screen.findAllByRole("dialog");
      await screen.findByText("Something went wrong in the Select component");
      await screen.findByText("Stack trace");
      await screen.findByText("Component stack trace");
      await screen.findByText("Latest run");
    });
  });
});
