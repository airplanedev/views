import { action } from "@storybook/addon-actions";
import { ComponentMeta, Story } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { AirplaneFile } from "airplane";
import withMock from "storybook-addon-mock";

import { Button } from "components/button/Button";
import { Card } from "components/card/Card";
import { Checkbox } from "components/checkbox/Checkbox";
import { DatePicker } from "components/datepicker/DatePicker";
import { FileInput } from "components/fileinput/FileInput";
import { Select } from "components/select/Select";
import { Slider } from "components/slider/Slider";
import { Stack } from "components/stack/Stack";
import { Switch } from "components/switch/Switch";
import { Text } from "components/text/Text";
import { Textarea } from "components/textarea/Textarea";
import { TextInput } from "components/textinput/TextInput";
import { TextInputState, useComponentState } from "state";
import { FormState } from "state/components/form/state";
import { mockRunData } from "storybook-utils/mockRunData";

import { Form } from "./Form";
import { FormProps } from "./Form.types";

const mockDataFileInput = [
  {
    url: "http://api/v0/uploads/create",
    method: "POST",
    status: 200,
    response: {
      upload: {
        id: "fileid",
      },
      readOnlyURL: "https://storage.googleapis.com/readOnlyURL",
      writeOnlyURL: "https://storage.googleapis.com/writeOnlyURL",
    },
  },
  {
    url: "https://storage.googleapis.com/writeOnlyURL",
    method: "PUT",
    status: 200,
  },
];

export default {
  title: "Form",
  component: Form,
  decorators: [withMock],
  parameters: { mockData: mockDataFileInput },
  argTypes: { onSubmit: { action: "submitted" } },
} as ComponentMeta<typeof Form>;

const Template: Story<FormProps> = (args) => <Form {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <TextInput id="name" label="Name" />
      <Select id="role" label="Role" data={["Engineer", "Support", "CEO"]} />
      <DatePicker id="dob" label="DOB" />
      <Textarea id="description" label="Description" />
      <Checkbox id="is-fulltime" label="Is full time employee" />
      <Switch id="is-over-21" label="Is over 21" />
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
      <FileInput id="resume" label="Resume" placeholder="Upload" />
    </>
  ),
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  children: (
    <>
      <TextInput
        required
        id="name"
        label="Name"
        description="Must be at least 3 characters"
        validate={(value) => {
          if (value.length < 3) {
            return "Name must be at least 3 characters";
          }
        }}
      />
      <Select
        required
        id="role"
        label="Role"
        description="Does not allow selecting CEO"
        data={["Engineer", "Support", "CEO"]}
        defaultValue="CEO"
        validate={(value) => {
          if (value === "CEO") {
            return "CEO do not allow selecting CEO";
          }
        }}
      />
      <DatePicker
        id="dob"
        required
        label="DOB"
        description="Cannot be born on 1995-12-17T03:24:00"
        defaultValue={new Date("1995-12-17T03:24:00")}
        validate={(value) => {
          if (value?.getTime() === new Date("1995-12-17T03:24:00").getTime()) {
            return "You cannot be born on this date";
          }
        }}
      />
      <Textarea
        required
        id="description"
        label="Description"
        description="Must be at least 10 characters"
        validate={(value) => {
          if (value.length < 10) {
            return "Description must be at least 10 characters";
          }
        }}
      />
      <Checkbox
        id="is-fulltime"
        label="Is full time employee (must be full time)"
        validate={(value) => {
          if (!value) {
            return "You must be full time";
          }
        }}
      />
      <Switch
        id="is-over-21"
        label="Is over 21"
        validate={(value) => {
          if (!value) {
            return "You must be 21";
          }
        }}
      />
      <Slider
        required
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
        validate={(value) => {
          if (value !== 1) {
            return "You must be a small";
          }
        }}
      />
      <FileInput
        required
        id="resume"
        label="Resume"
        placeholder="Upload pdf"
        validate={(value) => {
          if ((value as AirplaneFile)?.name.split(".").pop() !== "pdf") {
            return "Must upload a .pdf file";
          }
        }}
      />
    </>
  ),
};
WithValidation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await new Promise((r) => setTimeout(r, 500));
  const submit = await canvas.findByRole("button");
  await userEvent.click(submit);
  await canvas.findByText("CEO do not allow selecting CEO");
};

export const WithMultiValidation = Template.bind({});
WithMultiValidation.args = {
  children: (
    <>
      <TextInput
        required
        id="name"
        label="Name"
        description="Must be at least 3 characters and not start with 'b'"
        defaultValue="b"
        validate={[
          (value) => {
            if (value.length < 3) {
              return "Name must be at least 3 characters";
            }
          },
          (value) => {
            if (value.startsWith("b")) {
              return "Name must not start with 'b'";
            }
          },
        ]}
      />
      <Select
        required
        id="role"
        label="Role"
        description="Does not allow selecting CEO"
        data={["Engineer", "Support", "CEO"]}
        defaultValue="CEO"
        validate={[
          (value) => {
            if (value === "CEO") {
              return "CEO do not allow selecting CEO";
            }
          },
          (value) => {
            if (value === "CEO") {
              return "Really... No CEOs!";
            }
          },
        ]}
      />
      <Checkbox
        id="is-fulltime"
        label="Is full time employee (must be full time)"
        validate={[
          (value) => {
            if (!value) {
              return "You must be full time";
            }
          },
          (value) => {
            if (!value) {
              return "You cannot be part time";
            }
          },
        ]}
      />
    </>
  ),
};
WithMultiValidation.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await new Promise((r) => setTimeout(r, 500));
  const submit = await canvas.findByRole("button");
  await userEvent.click(submit);
  await canvas.findByText(
    `Name must be at least 3 characters Name must not start with 'b'`
  );
};

export const DependentFieldValidation = () => {
  const { id, values } = useComponentState<FormState>();
  return (
    <Form id={id} onSubmit={action("submitted")}>
      <TextInput id="name" label="Name" />
      <TextInput
        id="eye-color"
        label="Eye color"
        description="Must be green if name is John"
        validate={(value) => {
          if (values?.name === "John" && value !== "green") {
            return "John's eye color must be green";
          }
        }}
      />
    </Form>
  );
};

export const NoResetOnSubmit = Template.bind({});
NoResetOnSubmit.args = {
  children: (
    <>
      <TextInput id="name" label="Name" />
      <Select id="role" label="Role" data={["Engineer", "Support", "CEO"]} />
      <DatePicker id="dob" label="DOB" />
      <Textarea
        id="description"
        defaultValue="My default description"
        label="Description"
      />
      <Checkbox id="is-fulltime" label="Is full time employee" />
      <Switch id="is-over-21" label="Is over 21" />
      <FileInput id="resume" label="Resume" placeholder="Upload" />
    </>
  ),
  resetOnSubmit: false,
};

export const ManualResetButton = () => {
  const { id, reset } = useComponentState<FormState>();
  return (
    <Stack>
      <Form id={id} onSubmit={action("submitted")}>
        <TextInput id="name" label="Name" />
        <Select id="role" label="Role" data={["Engineer", "Support", "CEO"]} />
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
      <Button
        onClick={() => {
          reset();
        }}
      >
        Reset
      </Button>
    </Stack>
  );
};

export const MultipleForms = () => {
  return (
    <>
      <Stack>
        <Form
          onSubmit={(values) => {
            alert(`Submitted with values: ${JSON.stringify(values)}`);
          }}
        >
          <TextInput required id="cat_name" label="Cat name" />
        </Form>
      </Stack>
      <Stack>
        <Form
          onSubmit={(values) => {
            alert(`Submitted with values: ${JSON.stringify(values)}`);
          }}
        >
          <TextInput required id="dog_name" label="Dog Name" />
        </Form>
      </Stack>
    </>
  );
};

const mockData = [
  ...mockRunData("run123", () => "output"),
  {
    url: "http://api/v0/permissions/get?task_slug=every_optional_param&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": true, "tasks.request_run": true },
    },
  },
  {
    url: "http://api/v0/tasks/getTaskReviewers?taskSlug=every_optional_param",
    method: "GET",
    status: 200,
    response: {
      task: {
        parameters: {
          parameters: [
            {
              slug: "short_text",
              name: "Short text",
              type: "string",
              desc: "This is a short text field",
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
              desc: "This is a long text field",
              constraints: {
                optional: false,
              },
            },
            {
              slug: "sql",
              name: "SQL",
              type: "string",
              component: "editor-sql",
              desc: "This is a SQL field",
              constraints: {
                optional: true,
              },
            },
            {
              slug: "boolean",
              name: "Boolean",
              type: "boolean",
              desc: "This is a boolean field",
              constraints: {
                optional: true,
              },
            },
            {
              slug: "file",
              name: "File",
              type: "upload",
              desc: "This is an upload field",
              constraints: {
                optional: true,
              },
            },
            {
              slug: "number",
              name: "Number",
              type: "float",
              desc: "This is a float field",
              constraints: {
                optional: true,
              },
            },
            {
              slug: "integer",
              name: "Integer",
              type: "integer",
              desc: "This is an integer field",
              constraints: {
                optional: true,
              },
            },
            {
              slug: "date",
              name: "Date",
              type: "date",
              desc: "This is a date field",
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
            {
              slug: "date_and_time",
              name: "Date and time",
              type: "datetime",
              desc: "This is a datetime field",
              constraints: {
                optional: true,
              },
            },
          ],
        },
      },
    },
  },
];

const mockDataRequest = [
  {
    url: "http://api/v0/permissions/get?task_slug=every_optional_param&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": false, "tasks.request_run": true },
    },
  },
  {
    url: "http://api/v0/tasks/getTaskReviewers?taskSlug=every_optional_param",
    method: "GET",
    status: 200,
    response: {
      task: {
        name: "Every Optional Param",
        requireExplicitPermissions: false,
        triggers: [
          {
            kind: "form",
            triggerID: "trg20210728z3095m5",
          },
        ],
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
      reviewers: [],
    },
  },
  {
    url: "http://api/v0/requests/create",
    method: "POST",
    status: 200,
    response: { triggerRequestID: "trq20220830z4hycm98kq0" },
  },
  {
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
            userID: "usr20220429zeofnm8hkmw",
            name: "George Du",
            avatarURL:
              "https://lh3.googleusercontent.com/a-/AFdZucoyKtpOD1IhdGLIzr-H8aTyIRPLYvUm7-Y4aZBY=s96-c",
          },
          group: null,
        },
      ],
    },
  },
];

const mockDataNoPerms = [
  {
    url: "http://api/v0/permissions/get?task_slug=every_optional_param&actions=tasks.execute&actions=tasks.request_run",
    method: "GET",
    status: 200,
    response: {
      resource: { "tasks.execute": false, "tasks.request_run": false },
    },
  },
  {
    url: "http://api/v0/tasks/getTaskReviewers?taskSlug=every_optional_param",
    method: "GET",
    status: 200,
    response: {
      task: {
        name: "Every Optional Param",
        requireExplicitPermissions: false,
        triggers: [
          {
            kind: "form",
            triggerID: "trg20210728z3095m5",
          },
        ],
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
      reviewers: [],
    },
  },
];

export const RequestTask = () => {
  return <Form task="every_optional_param" />;
};
RequestTask.parameters = {
  mockData: mockDataRequest,
};

export const NoPermissions = () => {
  return <Form task="every_optional_param" />;
};
NoPermissions.parameters = {
  mockData: mockDataNoPerms,
};

export const WithTask = () => {
  const { id, values } = useComponentState<FormState>("formid");
  const { value } = useComponentState<TextInputState>("long_text");
  return (
    <>
      <Text>{`All form values: ${JSON.stringify(values)}`}</Text>
      <Text>{`Textarea value: ${value}`}</Text>
      <Form task="every_optional_param" id={id} />
    </>
  );
};
WithTask.parameters = {
  mockData,
};

export const ShownAndHiddenFields = () => {
  return (
    <Form
      task={{
        slug: "every_optional_param",
        shownFields: ["long_text", "date", "fake1"],
        hiddenFields: ["sql", "date", "fake2"],
      }}
    />
  );
};
ShownAndHiddenFields.parameters = {
  mockData,
};

export const FieldOptions = () => {
  return (
    <Form
      task={{
        slug: "every_optional_param",
        hiddenFields: ["sql", "file", "number"],
        fieldOptions: [
          { slug: "boolean", defaultValue: true },
          { slug: "long_text", value: "abc" },
          {
            slug: "short_text",
            allowedValues: ["cat", "dog"],
            defaultValue: "cat",
          },
          {
            slug: "integer",
            defaultValue: 5,
            disabled: true,
          },
          {
            slug: "date",
            allowedValues: ["2022-11-01", "2022-11-03T00:00:00Z"],
          },
          {
            slug: "date_and_time",
            allowedValues: ["2022-01-01", "2022-01-02"],
          },
        ],
      }}
    />
  );
};
FieldOptions.parameters = {
  mockData,
};

export const ValidationErrors = () => {
  return (
    <>
      <Form
        task={{
          slug: "every_optional_param",
          shownFields: ["date"],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [{ slug: "fake" }],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [{ slug: "short_text", allowedValues: [] }],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [{ slug: "boolean", value: 6 }],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [{ slug: "date_and_time", value: "abc" }],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [{ slug: "short_text", allowedValues: ["cat", "abc"] }],
        }}
      />
      <Form
        task={{
          slug: "every_optional_param",
          fieldOptions: [
            {
              slug: "date",
              allowedValues: ["2022-11-01", "2022-11-02T01:00:00Z"],
            },
          ],
        }}
      />
    </>
  );
};
ValidationErrors.parameters = {
  mockData,
};

export const InputsWithoutIds = Template.bind({});
InputsWithoutIds.args = {
  children: (
    <>
      <TextInput label="Text" />
      <TextInput label="Text" />
    </>
  ),
};

export const WrappedInCard = () => {
  return (
    <Card>
      <Default {...Default.args} />
    </Card>
  );
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: <TextInput id="name" label="Name" />,
  disabled: true,
};

export const Submitting = Template.bind({});
Submitting.args = {
  children: <TextInput id="name" label="Name" />,
  submitting: true,
};
