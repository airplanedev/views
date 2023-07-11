import { faker } from "@faker-js/faker";
import { Meta } from "@storybook/react";
import { ComponentType } from "react";

import {
  Button,
  Callout,
  Card,
  Chart,
  Code,
  DatePicker,
  DateTimePicker,
  DescriptionList,
  Divider,
  FileInput,
  Form,
  Heading,
  MultiSelect,
  NumberInput,
  ProgressBar,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from "components";
import { Default as CalloutDefault } from "components/callout/Callout.stories";
import { ScatterLog } from "components/chart/Chart.stories";
import { JS } from "components/code/Code.stories";
import { Default as DLDefault } from "components/descriptionList/DescriptionList.stories";
import {
  Default as FileInputDefault,
  Basic as FileInputBasic,
} from "components/fileinput/FileInput.stories";
import { CommonLayoutProps } from "components/layout/layout.types";
import { Default as MultiSelectDefault } from "components/multiselect/MultiSelect.stories";
import { Regular } from "components/progressBar/ProgressBar.stories";
import { Default as RadioGroupDefault } from "components/radioGroup/RadioGroup.stories";
import { Default as SelectDefault } from "components/select/Select.stories";
import { Simple as TableDefault } from "components/table/Table.stories";
import { Default as TextareaDefault } from "components/textarea/Textarea.stories";
import { Default as TextInputDefault } from "components/textinput/TextInput.stories";

export default {
  title: "Layout",
  component: Card,
} as Meta<typeof Card>;

const createStory = <P extends CommonLayoutProps>(
  Component: ComponentType<P>,
  props: P,
) => {
  return function LayoutStory() {
    return (
      <Card>
        <Stack>
          <Heading level={4}>width=1/2</Heading>
          <Component {...props} width="1/2" />
          <Heading level={4}>width=96u</Heading>
          <Component {...props} width="96u" />
          <Heading level={4}>width=200px</Heading>
          <Component {...props} width="200px" />
          <Heading level={4}>height=64u</Heading>
          <Component {...props} height="64u" />
          <Heading level={4}>height=200px</Heading>
          <Component {...props} height="200px" />
        </Stack>
      </Card>
    );
  };
};

export const Button_ = createStory(Button, { children: "Test" });
export const LinkButton_ = createStory(Button, {
  children: "Test",
  href: "https://www.airplane.dev",
});
export const Callout_ = createStory(Callout, CalloutDefault.args!);
export const Card_ = createStory(Card, { children: "Test" });
// @ts-ignore: The Story args type are all marked as optional, but the component has some required props.
export const Chart_ = createStory(Chart, {
  ...ScatterLog.args!,
  height: "96u",
});
// @ts-ignore
export const Code_ = createStory(Code, JS.args);
export const DatePicker_ = createStory(DatePicker, {});
export const DateTimePicker_ = createStory(DateTimePicker, {});
export const Divider_ = createStory(Divider, {});
// @ts-ignore
export const DescriptionList_ = createStory(DescriptionList, {
  ...DLDefault.args,
});
// @ts-ignore
export const FileInputDropzone = createStory(FileInput, FileInputDefault.args);
// @ts-ignore
export const FileInputBasic_ = createStory(FileInput, FileInputBasic.args);
export const Form_ = createStory(Form, {
  children: <TextInput label="Input" />,
});
export const Heading_ = createStory(Heading, {
  children: "This is my heading! Hello, world",
});
// @ts-ignore
export const MultiSelect_ = createStory(MultiSelect, MultiSelectDefault.args);
export const NumberInput_ = createStory(NumberInput, {});
// @ts-ignore
export const ProgressBar_ = createStory(ProgressBar, Regular.args);
// @ts-ignore
export const RadioGroup_ = createStory(RadioGroup, RadioGroupDefault.args);
// @ts-ignore
export const Select_ = createStory(Select, SelectDefault.args);
export const Slider_ = createStory(Slider, {});
export const Stack_ = createStory(Stack, { children: <Card>Test</Card> });
// @ts-ignore
export const Table_ = createStory(Table, TableDefault.args);
export const Text_ = createStory(Text, { children: faker.lorem.paragraph() });
// @ts-ignore
export const Textarea_ = createStory(Textarea, TextareaDefault.args);
// @ts-ignore
export const TextInput_ = createStory(TextInput, TextInputDefault.args);
