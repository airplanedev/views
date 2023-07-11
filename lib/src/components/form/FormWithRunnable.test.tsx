import userEvent from "@testing-library/user-event";
import airplane from "airplane";
import { rest } from "msw";

import { server } from "client/test-utils/mock";
import { Parameter } from "client/types";
import { Checkbox } from "components/checkbox/Checkbox";
import { RequestRunnableDialog } from "components/requestDialog/RequestRunnableDialog";
import { InputValues } from "state/components/form/state";
import { setupTaskAndRunbookPermissions } from "test-utils/permissions/permissionsTestUtils";
import { render, RenderResult, screen, waitFor } from "test-utils/react";
import {
  executeRunbookSuccess,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

import { Form } from "./Form";

jest.setTimeout(60000);
jest.mock("components/requestDialog/RequestRunnableDialog", () => ({
  RequestRunnableDialog: jest.fn(),
}));

interface InputTest {
  /** Input component name **/
  inputName: string;
  /** Async getter to get the input element **/
  asyncElementGetter: (renderResult: RenderResult) => Promise<Element>;
  /**
   * Tests submitting a runnable-backed form, where the runnable accepts the given input as a param.
   */
  paramTest: {
    update: (element: Element) => Promise<void>;
    expectedAfterUpdate: InputValues;
    paramDef: Parameter;
  };
}

const testCases: InputTest[] = [
  {
    inputName: "TextInput",
    asyncElementGetter: ({ findByRole }) => findByRole("textbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
      paramDef: {
        slug: "name",
        name: "Short text",
        type: "string",
        constraints: {
          optional: true,
        },
      },
    },
  },
  {
    inputName: "Textarea",
    asyncElementGetter: ({ findByRole }) => findByRole("textbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.type(el, "John");
      },
      expectedAfterUpdate: { name: "John" },
      paramDef: {
        slug: "name",
        name: "Long text",
        type: "string",
        component: "textarea",
        constraints: {
          optional: true,
        },
      },
    },
  },
  {
    inputName: "NumberInput",
    asyncElementGetter: ({ findByRole }) => findByRole("textbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.type(el, "100");
      },
      expectedAfterUpdate: { val: 100 },
      paramDef: {
        slug: "val",
        name: "Integer",
        type: "integer",
        constraints: {
          optional: true,
        },
      },
    },
  },
  {
    inputName: "Select",
    asyncElementGetter: ({ findByRole }) => findByRole("searchbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(screen.queryAllByRole("option")[0]);
      },
      expectedAfterUpdate: { role: "Engineer" },
      paramDef: {
        slug: "role",
        name: "Short text",
        type: "string",
        constraints: {
          optional: true,
          options: [
            { label: "", value: "Engineer" },
            { label: "", value: "Support" },
            { label: "", value: "CEO" },
          ],
        },
      },
    },
  },
  {
    inputName: "Checkbox",
    asyncElementGetter: ({ findByRole }) => findByRole("checkbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.click(el);
      },
      expectedAfterUpdate: { terms: true },
      paramDef: {
        slug: "terms",
        name: "Boolean",
        type: "boolean",
        constraints: {
          optional: true,
        },
      },
    },
  },
  {
    inputName: "DatePicker",
    asyncElementGetter: ({ findByRole }) => findByRole("textbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17) },
      paramDef: {
        slug: "date",
        name: "Date",
        type: "date",
        constraints: {
          optional: true,
        },
      },
    },
  },
  {
    inputName: "DateTimePicker",
    asyncElementGetter: ({ findByRole }) => findByRole("textbox"),
    paramTest: {
      update: async (el) => {
        await userEvent.click(el);
        await userEvent.click(await screen.findByText("17"));
        await userEvent.click(await screen.findByText("AM"));
      },
      expectedAfterUpdate: { date: new Date(2022, 0, 17, 12, 0) },
      paramDef: {
        slug: "date",
        name: "Date",
        type: "datetime",
        constraints: {
          optional: true,
        },
      },
    },
  },
];

const validationTestCases = [
  {
    testName: "checks value of hidden required fields",
    expectedError:
      "All required fields that are hidden must have a value specified",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            shownFields: ["date"],
          }}
        />
      );
    },
  },
  {
    testName: "checks for params not used by task",
    expectedError: "Found extraneous param in fieldOptions: fake",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "fake" }],
          }}
        />
      );
    },
  },
  {
    testName: "errors when allowedValues is empty",
    expectedError:
      "allowedValues for param short_text must have length at least 2",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "short_text", allowedValues: [] }],
          }}
        />
      );
    },
  },
  {
    testName: "errors when allowedValues has 1 element",
    expectedError:
      "allowedValues for param short_text must have length at least 2",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "short_text", allowedValues: ["cat"] }],
          }}
        />
      );
    },
  },
  {
    testName: "checks types",
    expectedError: "Value of param boolean must be a boolean",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "boolean", value: 6 }],
          }}
        />
      );
    },
  },
  {
    testName: "checks that date string is valid",
    expectedError: "abc is not a valid value for date",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "date", value: "abc" }],
          }}
        />
      );
    },
  },
  {
    testName: "checks allowedValues against allowed values in task definition",
    expectedError: "abc is not a valid value for short_text",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [
              { slug: "short_text", allowedValues: ["cat", "abc"] },
            ],
          }}
        />
      );
    },
  },
  {
    testName: "checks defaultValue against allowed values in task definition",
    expectedError: "abc is not a valid value for short_text",
    TestC: () => {
      return (
        <Form
          task={{
            slug: "every_optional_param",
            fieldOptions: [{ slug: "short_text", defaultValue: "abc" }],
          }}
        />
      );
    },
  },
];

describe("Form", () => {
  beforeEach(() => {
    setupTaskAndRunbookPermissions();
  });

  describe("with task", () => {
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date(2022, 0, 1), advanceTimers: true });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    testCases.forEach(({ inputName, asyncElementGetter, paramTest }) => {
      it(`${inputName} param`, async () => {
        server.use(
          rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
            return res(
              ctx.json({
                task: {
                  parameters: {
                    parameters: [paramTest.paramDef],
                  },
                },
              }),
            );
          }),
        );

        executeTaskSuccess({
          runID: "123",
        });

        const mockOnSubmit = jest.fn();
        const mockOnSuccess = jest.fn();
        const TestC = () => {
          return (
            <Form
              task={{
                slug: "params_test",
                onSuccess: mockOnSuccess,
              }}
              onSubmit={mockOnSubmit}
            />
          );
        };
        const result = render(<TestC />);
        const { getByRole } = result;
        const element = await asyncElementGetter(result);
        await paramTest.update(element);
        await userEvent.click(getByRole("button", { name: "Submit" }));
        await waitFor(() =>
          expect(mockOnSuccess).toHaveBeenLastCalledWith("value", "123"),
        );
        expect(mockOnSubmit).toHaveBeenLastCalledWith(
          paramTest.expectedAfterUpdate,
        );
      });
    });
  });

  describe("with runbook", () => {
    beforeAll(() => {
      jest.useFakeTimers({ now: new Date(2022, 0, 1), advanceTimers: true });
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    testCases.forEach(({ inputName, asyncElementGetter, paramTest }) => {
      it(`${inputName} param`, async () => {
        server.use(
          rest.get("http://api/v0/runbooks/get", (_, res, ctx) => {
            return res(
              ctx.json({
                task: {
                  parameters: {
                    parameters: [paramTest.paramDef],
                  },
                },
              }),
            );
          }),
        );

        executeRunbookSuccess({});

        const mockOnSubmit = jest.fn();
        const TestC = () => {
          return <Form runbook="params_test" onSubmit={mockOnSubmit} />;
        };
        const result = render(<TestC />);
        const { getByRole } = result;
        const element = await asyncElementGetter(result);
        await paramTest.update(element);
        await userEvent.click(getByRole("button", { name: "Submit" }));
        expect(mockOnSubmit).toHaveBeenLastCalledWith(
          paramTest.expectedAfterUpdate,
        );
      });
    });
  });

  describe("validation", () => {
    validationTestCases.forEach((v) => {
      it(v.testName, async () => {
        server.use(
          rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
            return res(
              ctx.json({
                task: {
                  parameters: {
                    parameters: [
                      {
                        slug: "short_text",
                        name: "Short text",
                        type: "string",
                        constraints: {
                          optional: true,
                          options: [
                            {
                              label: "",
                              value: "cat",
                            },
                            {
                              label: "",
                              value: "dog",
                            },
                            {
                              label: "",
                              value: "fish",
                            },
                          ],
                        },
                      },
                      {
                        slug: "long_text",
                        name: "Long text",
                        type: "string",
                        component: "textarea",
                        constraints: {
                          optional: false,
                        },
                      },
                      {
                        slug: "boolean",
                        name: "Boolean",
                        type: "boolean",
                        constraints: {
                          optional: true,
                        },
                      },
                      {
                        slug: "date",
                        name: "Date",
                        type: "date",
                        constraints: {
                          optional: true,
                          options: [
                            {
                              label: "",
                              value: "2022-11-03",
                            },
                            {
                              label: "",
                              value: "2022-11-02",
                            },
                            {
                              label: "",
                              value: "2022-11-01",
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              }),
            );
          }),
        );
        const { findByText } = render(<v.TestC />);
        await findByText(v.expectedError);
      });
    });
  });

  it("with extra input and beforeSubmitTransform", async () => {
    server.use(
      rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
        return res(
          ctx.json({
            task: {
              parameters: {
                parameters: [
                  {
                    slug: "sql",
                    name: "SQL",
                    type: "string",
                    component: "textarea",
                    constraints: {
                      optional: true,
                    },
                  },
                  {
                    slug: "integer",
                    name: "Integer",
                    type: "integer",
                    constraints: {
                      optional: true,
                      options: [
                        { label: "", value: "5" },
                        { label: "", value: "6" },
                      ],
                    },
                  },
                ],
              },
            },
          }),
        );
      }),
    );
    executeTaskSuccess({
      expectedParamValues: {
        sql: "Long text-suffix",
        integer: 6,
      },
    });
    const mockOnSubmit = jest.fn();
    const mockOnSuccess = jest.fn();
    const TestC = () => {
      return (
        <Form
          task={{ slug: "params_test", onSuccess: mockOnSuccess }}
          beforeSubmitTransform={(values) => ({
            ...values,
            sql: values.sql.concat("-suffix"),
            integer: parseInt(values.integer) + 1,
          })}
          onSubmit={mockOnSubmit}
        >
          <Checkbox id="terms" label="Terms" />
        </Form>
      );
    };
    const { getByRole, findByRole, queryAllByRole } = render(<TestC />);
    const sqlComponent = await findByRole("textbox");
    const integerSelectComponent = await findByRole("searchbox");
    await userEvent.type(sqlComponent, "Long text");
    await userEvent.click(integerSelectComponent);
    await userEvent.click(queryAllByRole("option")[0]);
    await userEvent.click(getByRole("checkbox"));
    await userEvent.click(getByRole("button", { name: "Submit" }));
    expect(mockOnSubmit).toHaveBeenLastCalledWith({
      sql: "Long text-suffix",
      integer: 6,
      terms: true,
    });
    await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
  });

  describe("with airplane fn", () => {
    beforeEach(() => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                parameters: {
                  parameters: [
                    {
                      slug: "name",
                      name: "Short text",
                      type: "string",
                      constraints: {
                        optional: true,
                      },
                    },
                    {
                      slug: "integer",
                      name: "Integer",
                      type: "integer",
                      constraints: {
                        optional: true,
                        options: [
                          { label: "", value: "5" },
                          { label: "", value: "6" },
                        ],
                      },
                    },
                  ],
                },
              },
            }),
          );
        }),
      );
    });

    it("in root", async () => {
      executeTaskSuccess();
      const mockOnSubmit = jest.fn();
      const TestC = () => {
        return (
          <Form
            task={airplane.task(
              {
                slug: "params_test",
              },
              (params) => "",
            )}
            onSubmit={mockOnSubmit}
          />
        );
      };
      const { getByRole, findByRole, queryAllByRole } = render(<TestC />);
      const integerSelectComponent = await findByRole("searchbox");
      await userEvent.click(integerSelectComponent);
      await userEvent.click(queryAllByRole("option")[0]);
      await userEvent.click(getByRole("button", { name: "Submit" }));
      expect(mockOnSubmit).toHaveBeenLastCalledWith({
        name: "",
        integer: "5",
      });
    });

    it("in field options", async () => {
      executeTaskSuccess({
        expectedParamValues: {
          integer: "5",
        },
      });
      const mockOnSubmit = jest.fn();
      const mockOnSuccess = jest.fn();
      const TestC = () => {
        return (
          <Form
            task={{
              fn: airplane.task(
                {
                  slug: "params_test",
                },
                (params) => "",
              ),
              shownFields: ["integer"],
              onSuccess: mockOnSuccess,
            }}
            onSubmit={mockOnSubmit}
          />
        );
      };
      const { getByRole, findByRole, queryAllByRole } = render(<TestC />);
      const integerSelectComponent = await findByRole("searchbox");
      await userEvent.click(integerSelectComponent);
      await userEvent.click(queryAllByRole("option")[0]);
      await userEvent.click(getByRole("button", { name: "Submit" }));
      expect(mockOnSubmit).toHaveBeenLastCalledWith({
        integer: "5",
      });
      await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    });
  });

  describe("field options", () => {
    it("with shownFields and fixed value", async () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                parameters: {
                  parameters: [
                    {
                      slug: "name",
                      name: "Short text",
                      type: "string",
                      constraints: {
                        optional: false,
                      },
                    },
                    {
                      slug: "integer",
                      name: "Integer",
                      type: "integer",
                      constraints: {
                        optional: true,
                        options: [
                          { label: "", value: "5" },
                          { label: "", value: "6" },
                        ],
                      },
                    },
                  ],
                },
              },
            }),
          );
        }),
      );
      executeTaskSuccess({
        expectedParamValues: {
          name: "George",
          integer: "5",
        },
      });
      const mockOnSubmit = jest.fn();
      const mockOnSuccess = jest.fn();
      const TestC = () => {
        return (
          <Form
            task={{
              slug: "params_test",
              shownFields: ["integer"],
              fieldOptions: [{ slug: "name", value: "George" }],
              onSuccess: mockOnSuccess,
            }}
            onSubmit={mockOnSubmit}
          />
        );
      };
      const { getByRole, findByRole, queryAllByRole } = render(<TestC />);
      const integerSelectComponent = await findByRole("searchbox");
      await userEvent.click(integerSelectComponent);
      await userEvent.click(queryAllByRole("option")[0]);
      await userEvent.click(getByRole("button", { name: "Submit" }));
      expect(mockOnSubmit).toHaveBeenLastCalledWith({
        name: "George",
        integer: "5",
      });
      await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    });

    it("with hiddenFields and allowedValues", async () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                parameters: {
                  parameters: [
                    {
                      slug: "name",
                      name: "Short text",
                      type: "string",
                      constraints: {
                        optional: true,
                      },
                    },
                    {
                      slug: "integer",
                      name: "Integer",
                      type: "integer",
                      constraints: {
                        optional: false,
                        options: [
                          { label: "", value: "5" },
                          { label: "", value: "6" },
                          { label: "", value: "7" },
                        ],
                      },
                    },
                  ],
                },
              },
            }),
          );
        }),
      );
      executeTaskSuccess({
        expectedParamValues: {
          integer: "6",
        },
      });
      const mockOnSubmit = jest.fn();
      const mockOnSuccess = jest.fn();
      const TestC = () => {
        return (
          <Form
            task={{
              slug: "params_test",
              hiddenFields: ["name"],
              fieldOptions: [{ slug: "integer", allowedValues: [6, 7] }],
              onSuccess: mockOnSuccess,
            }}
            onSubmit={mockOnSubmit}
          />
        );
      };
      const { getByRole, findByRole, queryAllByRole } = render(<TestC />);
      const integerSelectComponent = await findByRole("searchbox");
      await userEvent.click(integerSelectComponent);
      await userEvent.click(queryAllByRole("option")[0]);
      await userEvent.click(getByRole("button", { name: "Submit" }));
      expect(mockOnSubmit).toHaveBeenLastCalledWith({
        integer: "6",
      });
      await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledTimes(1));
    });

    it("with user-provided validation function", async () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                parameters: {
                  parameters: [
                    {
                      slug: "long_text",
                      name: "Long text",
                      type: "string",
                      component: "textarea",
                      constraints: {
                        optional: false,
                      },
                    },
                  ],
                },
              },
            }),
          );
        }),
      );
      const TestC = () => {
        return (
          <Form
            task={{
              slug: "params_test",
              fieldOptions: [
                {
                  slug: "long_text",
                  defaultValue: "John",
                  validate: (value) => {
                    if (value === "John") {
                      return "John is not allowed";
                    }
                  },
                },
              ],
            }}
          />
        );
      };
      const { findByText, getByRole } = render(<TestC />);
      await findByText("John");
      await userEvent.click(getByRole("button", { name: "Submit" }));
      await findByText("John is not allowed");
    });

    it("with disabled", async () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                parameters: {
                  parameters: [
                    {
                      slug: "long_text",
                      name: "Long text",
                      type: "string",
                      component: "textarea",
                      constraints: {
                        optional: false,
                      },
                    },
                  ],
                },
              },
            }),
          );
        }),
      );
      const TestC = () => {
        return (
          <Form
            task={{
              slug: "params_test",
              fieldOptions: [
                {
                  slug: "long_text",
                  disabled: true,
                },
              ],
            }}
          />
        );
      };
      const { findByRole } = render(<TestC />);
      const input = await findByRole("textbox");
      expect(input).toBeDisabled();
    });
  });
});

describe("Request Task Dialog", () => {
  beforeEach(() => {
    setupTaskAndRunbookPermissions({ execute: false, request: true });
  });

  it("opens dialog with task request perms", async () => {
    server.use(
      rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
        return res(
          ctx.json({
            task: {
              parameters: {
                parameters: [
                  {
                    slug: "name",
                    name: "Short text",
                    type: "string",
                    constraints: {
                      optional: true,
                    },
                  },
                ],
              },
            },
          }),
        );
      }),
    );
    const { findByRole } = render(<Form task="slug" />);
    const textComponent = await findByRole("textbox");
    await userEvent.type(textComponent, "foo");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(RequestRunnableDialog).toHaveBeenCalledWith(
      {
        opened: true,
        onSubmit: expect.anything(),
        onClose: expect.anything(),
        taskSlug: "slug",
        paramValues: { name: "foo" },
      },
      expect.anything(),
    );
  });

  it("opens dialog with runbook request perms", async () => {
    server.use(
      rest.get("http://api/v0/runbooks/get", (_, res, ctx) => {
        return res(
          ctx.json({
            task: {
              parameters: {
                parameters: [
                  {
                    slug: "name",
                    name: "Short text",
                    type: "string",
                    constraints: {
                      optional: true,
                    },
                  },
                ],
              },
            },
          }),
        );
      }),
    );
    const { findByRole } = render(<Form runbook="slug" />);
    const textComponent = await findByRole("textbox");
    await userEvent.type(textComponent, "bar");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(RequestRunnableDialog).toHaveBeenCalledWith(
      {
        opened: true,
        onSubmit: expect.anything(),
        onClose: expect.anything(),
        runbookSlug: "slug",
        paramValues: { name: "bar" },
      },
      expect.anything(),
    );
  });
});
