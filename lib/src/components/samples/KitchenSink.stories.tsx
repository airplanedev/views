import { Meta } from "@storybook/react";

import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Checkbox } from "../checkbox/Checkbox";
import { Divider } from "../divider/Divider";
import { Heading } from "../heading/Heading";
import { Select } from "../select/Select";
import { Stack } from "../stack/Stack";
import { Table } from "../table/Table";
import { createRandomUsers, User, USER_COLUMNS } from "../table/testdata";
import { Text } from "../text/Text";
import { TextInput } from "../textinput/TextInput";

const tale = `
# A Tale of Two Cities

It was the best of times, it was the worst of times, it was the age
of wisdom, it was the age of foolishness, it was the epoch of
belief, it was the epoch of incredulity, it was the season of Light,
it was the season of Darkness, it was the spring of hope, it was the
winter of despair, we had everything before us, we had nothing
before us, we were all going direct to Heaven, we were all going
direct the other way--in short, the period was so far like the
present period that some of its noisiest authorities insisted on its
being received, for good or for evil, in the superlative degree of
comparison only.

~~~
const author = "Charles Dickens";
~~~
`;

const KitchenSink = () => (
  <>
    <Stack>
      <Stack direction="row">
        <Table<User>
          width="1/3"
          columns={USER_COLUMNS}
          data={createRandomUsers(20)}
        />
        <Table<User>
          width="1/3"
          columns={USER_COLUMNS}
          data={createRandomUsers(20)}
        />
        <Stack width="1/3" direction="column">
          <Select label="Test select" data={["Giraffe", "Dog", "Cat"]} />
          <Button>Click me</Button>
          <Divider />
          <Card>
            <Text>{tale}</Text>
          </Card>
          <Divider />
          <Card>
            <Heading>Oliver Twist</Heading>
            <Text>Please, sir, may I have some more please?</Text>
          </Card>
          <Divider />
          <TextInput label="Test input" />
          <Checkbox label="My checkbox" />
        </Stack>
      </Stack>
      <Stack direction="row" grow>
        <Heading>A Whole New World</Heading>
        <Button>Big button</Button>
      </Stack>
    </Stack>
  </>
);

export default {
  title: "Samples/KitchenSink",
  component: KitchenSink,
} as Meta<typeof KitchenSink>;

export const Default = () => <KitchenSink />;
