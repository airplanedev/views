import { Meta, StoryFn } from "@storybook/react";
import { AirplaneFile } from "airplane";
import { useState } from "react";
import withMock from "storybook-addon-mock";

import { Button } from "components/button/Button";
import { Text } from "components/text/Text";
import { FileInputState, useComponentState } from "state";

import { FileInput } from "./FileInput";

const mockData = [
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

const f1 = new AirplaneFile(new Blob(["foo"]), {
  id: "",
  url: "",
  name: "foo.txt",
});
const f2 = new AirplaneFile(new Blob(["bar"]), {
  id: "",
  url: "",
  name: "bar.txt",
});
const f3 = new AirplaneFile(new Blob(["baz"]), {
  id: "",
  url: "",
  name: "baz.txt",
});

export default {
  title: "FileInput",
  component: FileInput,
  decorators: [withMock],
  parameters: { mockData },
} as Meta<typeof FileInput>;

const Template: StoryFn<typeof FileInput> = (args) => {
  const { id, value } = useComponentState();
  return (
    <>
      <FileInput id={id} {...args} />
      <Text>{JSON.stringify(value)}</Text>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  description: "Description",
  placeholder: "Placeholder",
  required: true,
  clearable: true,
};

export const Basic = Template.bind({});
Basic.args = {
  label: "Label",
  description: "Description",
  placeholder: "Placeholder",
  required: true,
  clearable: true,
  variant: "basic",
};

export const Error = Template.bind({});
Error.args = {
  label: "Label",
  description: "Description",
  placeholder: "Placeholder",
  error: "Error",
};

export const MultipleImages = Template.bind({});
MultipleImages.args = {
  multiple: true,
  accept: ["image/png", "image/jpeg"],
  sx: { width: 500, border: "solid" },
};

export const MultipleImagesBasic = Template.bind({});
MultipleImagesBasic.args = {
  multiple: true,
  accept: ["image/png", "image/jpeg"],
  variant: "basic",
};

export const ControlledSingle = () => {
  const [value, setValue] = useState<AirplaneFile | undefined>(f1);
  return (
    <>
      <Button onClick={() => setValue(f2)}>button</Button>
      <FileInput value={value} onChange={setValue} />
    </>
  );
};
export const ControlledMultiple = () => {
  const [value, setValue] = useState<AirplaneFile[]>([f1]);
  return (
    <>
      <Button onClick={() => setValue([f2, f3])}>button</Button>
      <FileInput multiple value={value} onChange={setValue} />
    </>
  );
};

export const Disable = () => {
  const inputState = useComponentState<FileInputState>("myFileInput");
  return (
    <>
      <Button onClick={() => inputState.setDisabled(!inputState.disabled)}>
        Disable
      </Button>
      <FileInput id="myFileInput" />
    </>
  );
};
