import userEvent from "@testing-library/user-event";
import { useState } from "react";
import * as React from "react";

import { Button } from "components/button/Button";
import { Checkbox } from "components/checkbox/Checkbox";
import { DatePicker } from "components/datepicker/DatePicker";
import { DateTimePicker } from "components/datepicker/DateTimePicker";
import { NumberInput } from "components/number/NumberInput";
import { Select } from "components/select/Select";
import { Slider } from "components/slider/Slider";
import { Switch } from "components/switch/Switch";
import { Textarea } from "components/textarea/Textarea";
import { TextInput } from "components/textinput/TextInput";
import { TextInputState, useComponentState } from "state";
import { FormState, InputValues } from "state/components/form/state";
import { REQUIRED_ERROR } from "state/components/input/runValidation";
import { render, RenderResult, screen, waitFor } from "test-utils/react";

import { Form } from "./Form";

jest.setTimeout(60000);

interface InputTest {
  /** Input component name **/
  inputName: string;
  /** Getter to get the input element **/
  elementGetter: (renderResult: RenderResult) => Element;
  /**
   * Tests submitting a form with the input
   *
   * The input is rendered within a form, the form is submitted, the input is updated,
   * and the form is submitted again.
   */
  submitTest: {
    render: React.ReactNode;
    expectedEmpty: InputValues;
    update: (element: Element) => Promise<void>;
    expectedAfterUpdate: InputValues;
  };
  /**
   * Tests submitting a form with the input that's required
   *
   * The form is submitted and hits a required error. Then the input is updated and the form is submitted again.
   * This time, there is no error since the input is no longer empty.
   */
  requiredTest?: {
    render: React.ReactNode;
    update: (element: Element) => Promise<void>;
  };
  /**
   * Tests the input's validation
   *
   * The input is rendered with an invalid value and then submitted.
   */
  validateTest: {
    render: React.ReactNode;
    expectedError: string;
  };
  /**
   * Test the behavior of resetOnSubmit for each input.
   *
   * The input is updated and then the form is submitted. We then submit the form again to assert whether the
   * input was reset.
   */
  resetOnSubmitTest: {
    render: React.ReactNode;
    update: (element: Element) => Promise<void>;
    expectedAfterUpdate: InputValues;
    expectedAfterReset: InputValues;
  };
}

const testCases: InputTest[] = [
  {
    inputName: "TextInput",
    elementGetter: ({ getByRole }) => getByRole("textbox"),
    submitTest: {
      render: <TextInput id="name" label="Name" />,
      expectedEmpty: { name: "" },
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
    },
    requiredTest: {
      render: <TextInput id="name" label="Name" required />,
      update: async (el) => {
        await userEvent.type(el, "John");
      },
    },
    validateTest: {
      render: (
        <TextInput
          id="name"
          label="Name"
          defaultValue="John"
          validate={(value) => {
            if (value === "John") {
              return "John is not allowed";
            }
          }}
        />
      ),
      expectedError: "John is not allowed",
    },
    resetOnSubmitTest: {
      render: <TextInput id="name" label="Name" />,
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
      expectedAfterReset: { name: "" },
    },
  },
  {
    inputName: "Textarea",
    elementGetter: ({ getByRole }) => getByRole("textbox"),
    submitTest: {
      render: <Textarea id="name" label="Name" />,
      expectedEmpty: { name: "" },
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
    },
    requiredTest: {
      render: <Textarea id="name" label="Name" required />,
      update: async (el) => {
        await userEvent.type(el, "John");
      },
    },
    validateTest: {
      render: (
        <Textarea
          id="name"
          label="Name"
          defaultValue="John"
          validate={(value) => {
            if (value === "John") {
              return "John is not allowed";
            }
          }}
        />
      ),
      expectedError: "John is not allowed",
    },
    resetOnSubmitTest: {
      render: <Textarea id="name" label="Name" />,
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
      expectedAfterReset: { name: "" },
    },
  },
  {
    inputName: "NumberInput",
    elementGetter: ({ getByRole }) => getByRole("textbox"),
    submitTest: {
      render: <NumberInput id="val" label="Value" />,
      expectedEmpty: { val: undefined },
      update: async (el) => {
        await userEvent.type(el, "100");
      },
      expectedAfterUpdate: { val: 100 },
    },
    validateTest: {
      render: (
        <NumberInput
          id="val"
          label="Value"
          defaultValue={96}
          validate={(value) => {
            if (value === 96) {
              return "96 is not allowed";
            }
          }}
        />
      ),
      expectedError: "96 is not allowed",
    },
    resetOnSubmitTest: {
      render: <NumberInput id="val" label="Value" />,
      update: async (el) => {
        await userEvent.type(el, "100");
      },
      expectedAfterUpdate: { val: 100 },
      expectedAfterReset: { val: undefined },
    },
  },
  {
    inputName: "Select",
    elementGetter: ({ getByRole }) => getByRole("searchbox"),
    submitTest: {
      render: (
        <Select id="role" label="Role" data={["Engineer", "Support", "CEO"]} />
      ),
      expectedEmpty: { role: undefined },
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(screen.queryAllByRole("option")[0]);
      },
      expectedAfterUpdate: { role: "Engineer" },
    },
    requiredTest: {
      render: (
        <Select
          required
          id="role"
          label="Role"
          data={["Engineer", "Support", "CEO"]}
        />
      ),
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(screen.queryAllByRole("option")[0]);
      },
    },
    validateTest: {
      render: (
        <Select
          id="role"
          label="Role"
          defaultValue="CEO"
          data={["Engineer", "Support", "CEO"]}
          validate={(value) => {
            if (value === "CEO") {
              return "CEOs are not allowed";
            }
          }}
        />
      ),
      expectedError: "CEOs are not allowed",
    },
    resetOnSubmitTest: {
      render: (
        <Select id="role" label="Role" data={["Engineer", "Support", "CEO"]} />
      ),
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(screen.queryAllByRole("option")[0]);
      },
      expectedAfterUpdate: { role: "Engineer" },
      expectedAfterReset: { role: undefined },
    },
  },
  {
    inputName: "Checkbox",
    elementGetter: ({ getByRole }) => getByRole("checkbox"),
    submitTest: {
      render: <Checkbox id="terms" label="Terms" />,
      expectedEmpty: { terms: false },
      update: async (el) => {
        await userEvent.click(el);
      },
      expectedAfterUpdate: { terms: true },
    },
    validateTest: {
      render: (
        <Checkbox
          id="terms"
          label="Terms"
          validate={(value) => {
            if (!value) {
              return "You must not agree to the terms";
            }
          }}
        />
      ),
      expectedError: "You must not agree to the terms",
    },
    resetOnSubmitTest: {
      render: <Checkbox id="terms" label="Terms" />,
      update: async (el) => {
        await userEvent.click(el);
      },
      expectedAfterUpdate: { terms: true },
      expectedAfterReset: { terms: false },
    },
  },
  {
    inputName: "DatePicker",
    elementGetter: ({ getByRole }) => getByRole("textbox"),
    submitTest: {
      render: <DatePicker id="date" label="Date" />,
      expectedEmpty: { date: undefined },
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17) },
    },
    requiredTest: {
      render: <DatePicker id="date" label="Date" required />,
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
      },
    },
    validateTest: {
      render: (
        <DatePicker
          id="date"
          label="Date"
          defaultValue={new Date(1, 1, 2022)}
          validate={(value) => {
            if (value && value.getTime() === new Date(1, 1, 2022).getTime()) {
              return "Cannot be this time";
            }
          }}
        />
      ),
      expectedError: "Cannot be this time",
    },
    resetOnSubmitTest: {
      render: <DatePicker id="date" label="Date" />,
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17) },
      expectedAfterReset: { date: undefined },
    },
  },
  {
    inputName: "DateTimePicker",
    elementGetter: ({ getByRole }) => getByRole("textbox"),
    submitTest: {
      render: <DateTimePicker id="date" label="Date" />,
      expectedEmpty: { date: undefined },
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
        await userEvent.click(await screen.findByText("AM"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17, 12, 0) },
    },
    requiredTest: {
      render: <DateTimePicker id="date" label="Date" required />,
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
        await userEvent.click(await screen.findByText("AM"));
      },
    },
    validateTest: {
      render: (
        <DateTimePicker
          id="date"
          label="Date"
          defaultValue={new Date(1, 1, 2022)}
          validate={(value) => {
            if (value && value.getTime() === new Date(1, 1, 2022).getTime()) {
              return "Cannot be this time";
            }
          }}
        />
      ),
      expectedError: "Cannot be this time",
    },
    resetOnSubmitTest: {
      render: <DateTimePicker id="date" label="Date" />,
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
        await userEvent.click(await screen.findByText("AM"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17, 12, 0) },
      expectedAfterReset: { date: undefined },
    },
  },
  {
    inputName: "Switch",
    elementGetter: ({ getByRole }) => getByRole("checkbox"),
    submitTest: {
      render: <Switch id="terms" label="Terms" />,
      expectedEmpty: { terms: false },
      update: async (el) => {
        await userEvent.click(el);
      },
      expectedAfterUpdate: { terms: true },
    },
    validateTest: {
      render: (
        <Switch
          id="terms"
          label="Terms"
          validate={(value) => {
            if (!value) {
              return "You must not agree to the terms";
            }
          }}
        />
      ),
      expectedError: "You must not agree to the terms",
    },
    resetOnSubmitTest: {
      render: <Switch id="terms" label="Terms" />,
      update: async (el) => {
        await userEvent.click(el);
      },
      expectedAfterUpdate: { terms: true },
      expectedAfterReset: { terms: false },
    },
  },
  {
    inputName: "Slider",
    elementGetter: ({ getByTestId }) => getByTestId("s1"),
    submitTest: {
      render: <Slider id="val" label="Value" data-testid="s1" />,
      expectedEmpty: { val: 0 },
      update: async (el) => {
        await userEvent.type(el, "{arrowright}");
      },
      expectedAfterUpdate: { val: 1 },
    },
    validateTest: {
      render: (
        <Slider
          id="val"
          label="Value"
          defaultValue={96}
          validate={(value) => {
            if (value === 96) {
              return "96 is not allowed";
            }
          }}
          data-testid="s1"
        />
      ),
      expectedError: "96 is not allowed",
    },
    resetOnSubmitTest: {
      render: <Slider id="val" label="Value" data-testid="s1" />,
      update: async (el) => {
        await userEvent.type(el, "{arrowright}");
      },
      expectedAfterUpdate: { val: 1 },
      expectedAfterReset: { val: 0 },
    },
  },
];

describe("Form", () => {
  describe("form input components", () => {
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date(2022, 0, 1), advanceTimers: true });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    testCases.forEach(
      ({
        inputName,
        elementGetter,
        submitTest,
        requiredTest,
        validateTest,
        resetOnSubmitTest,
      }) => {
        describe(inputName, () => {
          it(`submits`, async () => {
            const mockOnSubmit = jest.fn();
            const result = render(
              <Form onSubmit={mockOnSubmit}>{submitTest.render}</Form>,
            );
            const { getByRole } = result;
            await userEvent.click(getByRole("button", { name: "Submit" }));
            expect(mockOnSubmit).toHaveBeenLastCalledWith(
              submitTest.expectedEmpty,
            );

            await submitTest.update(elementGetter(result));
            await userEvent.click(getByRole("button", { name: "Submit" }));
            expect(mockOnSubmit).toHaveBeenLastCalledWith(
              submitTest.expectedAfterUpdate,
            );
          });

          if (requiredTest) {
            it(`validates required`, async () => {
              const result = render(<Form>{requiredTest.render}</Form>);
              const { getByText, queryByText, findByRole } = result;

              // No errors are displayed initially
              expect(queryByText(REQUIRED_ERROR)).toBeFalsy();

              // Error shows up on submit
              const submitButton = await findByRole("button", {
                name: "Submit",
              });
              await userEvent.click(submitButton);
              expect(getByText(REQUIRED_ERROR)).toBeInTheDocument();

              // Errors disappears once the field is updated
              await requiredTest.update(elementGetter(result));
              await waitFor(() => expect(submitButton).not.toBeDisabled());
              expect(queryByText(REQUIRED_ERROR)).toBeFalsy();
            });
          }

          it("validates custom validate function", async () => {
            const result = render(<Form>{validateTest.render}</Form>);
            const { getByRole, findByText } = result;

            await userEvent.click(getByRole("button", { name: "Submit" }));
            await findByText(validateTest.expectedError);
          });

          describe("resetOnSubmit", () => {
            it("resets on submit", async () => {
              const mockOnSubmit = jest.fn();
              const result = render(
                <Form resetOnSubmit onSubmit={mockOnSubmit}>
                  {resetOnSubmitTest.render}
                </Form>,
              );
              const { getByRole } = result;
              const submitButton = getByRole("button", { name: "Submit" });

              await resetOnSubmitTest.update(elementGetter(result));
              await userEvent.click(submitButton);
              expect(mockOnSubmit).toHaveBeenLastCalledWith(
                resetOnSubmitTest.expectedAfterUpdate,
              );

              await userEvent.click(submitButton);
              expect(mockOnSubmit).toHaveBeenLastCalledWith(
                resetOnSubmitTest.expectedAfterReset,
              );
            });

            it("does not reset on submit", async () => {
              const mockOnSubmit = jest.fn();
              const result = render(
                <Form resetOnSubmit={false} onSubmit={mockOnSubmit}>
                  {resetOnSubmitTest.render}
                </Form>,
              );
              const { getByRole } = result;
              const submitButton = getByRole("button", { name: "Submit" });

              await resetOnSubmitTest.update(elementGetter(result));
              await userEvent.click(submitButton);
              expect(mockOnSubmit).toHaveBeenLastCalledWith(
                resetOnSubmitTest.expectedAfterUpdate,
              );

              await userEvent.click(submitButton);
              expect(mockOnSubmit).toHaveBeenLastCalledWith(
                resetOnSubmitTest.expectedAfterUpdate,
              );
            });
          });
        });
      },
    );
  });

  it("submits with form state when conditional form inputs have the same id", async () => {
    const mockOnSubmit = jest.fn();
    const TestC = () => {
      const [mode, setMode] = useState<"text" | "checkbox">("text");
      return (
        <Form onSubmit={mockOnSubmit}>
          {mode === "text" ? (
            <TextInput id="input" label="Input" />
          ) : (
            <Checkbox id="input" label="Input" />
          )}
          <Button
            onClick={() => setMode(mode === "text" ? "checkbox" : "text")}
          >
            Change mode
          </Button>
        </Form>
      );
    };
    const { getByRole } = render(<TestC />);

    await userEvent.type(getByRole("textbox"), "John");
    await userEvent.click(getByRole("button", { name: "Submit" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      input: "John",
    });

    await userEvent.click(getByRole("button", { name: "Change mode" }));
    await userEvent.click(getByRole("checkbox"));
    await userEvent.click(getByRole("button", { name: "Submit" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      input: true,
    });
  });

  it("validates with multiple validate functions", async () => {
    const expectedNameLengthError = "Name must be at least 3 characters";
    const expectedNamePatternError = "Name must not start with 'b'";
    const { getByText, queryByText, getByRole } = render(
      <Form>
        <TextInput
          required
          id="name"
          label="Name"
          validate={[
            (value) => {
              if (value.length < 3) {
                return expectedNameLengthError;
              }
            },
            (value) => {
              if (value.startsWith("b")) {
                return expectedNamePatternError;
              }
            },
          ]}
        />
      </Form>,
    );

    // No errors are displayed initially
    expect(queryByText("Name must", { exact: false })).not.toBeInTheDocument();

    await userEvent.click(getByRole("button", { name: "Submit" }));

    // Fails custom validation
    await userEvent.type(getByRole("textbox"), "b");
    expect(
      getByText(`${expectedNameLengthError}`, { exact: false }),
    ).toBeInTheDocument();
    expect(
      getByText(`${expectedNamePatternError}`, { exact: false }),
    ).toBeInTheDocument();
  });

  it("supports dependent fields validation", async () => {
    const TestC = () => {
      const { id, values } = useComponentState<FormState>();
      return (
        <Form id={id}>
          <TextInput id="name" label="Name" />
          <TextInput
            id="eye-color"
            label="Eye color"
            validate={(value) => {
              if (values?.name === "John" && value !== "green") {
                return "John's eye color must be green";
              }
            }}
          />
        </Form>
      );
    };

    const { queryByText, getByRole } = render(<TestC />);

    await userEvent.type(getByRole("textbox", { name: "Name" }), "John");
    await userEvent.type(getByRole("textbox", { name: "Eye color" }), "blue");

    const submitButton = getByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);

    expect(queryByText("John's eye color must be green")).toBeInTheDocument();

    await userEvent.type(
      getByRole("textbox", { name: "Eye color" }),
      "{backspace}{backspace}{backspace}{backspace}green",
    );

    await userEvent.click(submitButton);

    expect(
      queryByText("John's eye color must be green"),
    ).not.toBeInTheDocument();
  });

  it("resets using global component state reset", async () => {
    const mockOnSubmit = jest.fn();
    const TestC = () => {
      const { id, reset } = useComponentState<FormState>();
      return (
        <>
          <Form id={id} onSubmit={mockOnSubmit}>
            <TextInput id="name" label="Name" />
            <Select
              id="role"
              label="Role"
              data={["Engineer", "Support", "CEO"]}
            />
          </Form>
          <Button
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </>
      );
    };
    const { getByRole, queryAllByRole } = render(<TestC />);
    await userEvent.type(getByRole("textbox"), "John");
    await userEvent.click(getByRole("searchbox"));
    await userEvent.click(queryAllByRole("option")[0]);
    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(mockOnSubmit).toHaveBeenLastCalledWith({
      name: "John",
      role: "Engineer",
    });

    await userEvent.click(getByRole("button", { name: "Reset" }));
    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(mockOnSubmit).toHaveBeenLastCalledWith({
      name: "",
      role: undefined,
    });
  });

  it("validates required with external state change", async () => {
    const TestC = () => {
      const { id, setValue } = useComponentState<TextInputState>("name");
      return (
        <>
          <Form>
            <TextInput required id={id} label="Name" />
          </Form>
          <Button
            onClick={() => {
              setValue("John");
            }}
          >
            Set name
          </Button>
        </>
      );
    };
    const { getByText, queryByText, getByRole } = render(<TestC />);

    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(getByText(REQUIRED_ERROR)).toBeInTheDocument();

    await userEvent.click(getByRole("button", { name: "Set name" }));
    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(queryByText(REQUIRED_ERROR)).not.toBeInTheDocument();
  });

  it("renders multiple forms", async () => {
    const mockOnSubmit = jest.fn();
    const mockOnSubmit2 = jest.fn();
    const TestC = () => {
      return (
        <>
          <Form onSubmit={mockOnSubmit}>
            <TextInput id="input" label="Input" />
          </Form>
          <Form onSubmit={mockOnSubmit2}>
            <TextInput id="input2" label="Input2" />
          </Form>
        </>
      );
    };
    const { findAllByRole } = render(<TestC />);

    const textBoxes = await findAllByRole("textbox");
    const submits = await findAllByRole("button");

    await userEvent.type(textBoxes[0], "John");
    await userEvent.type(textBoxes[1], "Jane");

    await userEvent.click(submits[0]);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      input: "John",
    });

    await userEvent.click(submits[1]);
    expect(mockOnSubmit2).toHaveBeenCalledWith({
      input2: "Jane",
    });

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit2).toHaveBeenCalledTimes(1);
  });

  it("works with inputs without explicitly defined ids", async () => {
    const mockOnSubmit = jest.fn();
    const TestC = () => {
      return (
        <Form onSubmit={mockOnSubmit}>
          <TextInput label="Input" />
          <Select label="Role" data={["Engineer", "Support", "CEO"]} />
        </Form>
      );
    };
    const { getByRole, queryAllByRole } = render(<TestC />);

    const textInput = getByRole("textbox");
    await userEvent.type(textInput, "John");
    const select = getByRole("searchbox");
    await userEvent.click(select);
    await userEvent.click(queryAllByRole("option")[0]);

    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(mockOnSubmit.mock.calls.length).toBe(1);
    expect(Object.values(mockOnSubmit.mock.calls[0][0]).sort()).toEqual([
      "Engineer",
      "John",
    ]);

    // Verify that the form was reset
    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(mockOnSubmit.mock.calls.length).toBe(2);
    expect(Object.values(mockOnSubmit.mock.calls[1][0]).sort()).toEqual([
      "",
      undefined,
    ]);
  });
});
