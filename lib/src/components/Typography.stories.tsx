import { Meta } from "@storybook/react";

import { Heading } from "components";

import { Card } from "./card/Card";
import { Stack } from "./stack/Stack";
import { Text } from "./text/Text";

const Typography = () => {
  return (
    <Stack>
      <Stack spacing={0}>
        <Heading level={1}>Acme organization's dashboard</Heading>
        <Text>
          Welcome to Acme's internal dashboard. Please read the instructions
          before proceeding.
        </Text>
        <Heading level={2}>Instructions for the reader</Heading>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Sagittis
          eu volutpat odio facilisis mauris. Eget felis eget nunc lobortis
          mattis aliquam faucibus purus. Ullamcorper dignissim cras tincidunt
          lobortis feugiat. Urna nec tincidunt praesent semper.
        </Text>
        <Heading level={3}>First rule of Acme organization</Heading>
        <Text>
          Magnis dis parturient montes nascetur ridiculus mus mauris vitae. Sit
          amet nisl purus in mollis nunc. Pellentesque dignissim enim sit amet
          venenatis urna cursus.
        </Text>
        <Heading level={3} color="error">
          Second rule is fake
        </Heading>
        <Text>
          Tempor nec feugiat nisl pretium fusce id. Aliquam id diam maecenas
          ultricies mi eget mauris pharetra. Aliquam purus sit amet luctus.
          Risus pretium quam vulputate dignissim suspendisse.
        </Text>
        <Heading level={3}>Third rule is key</Heading>
        <Text>
          Quis risus sed vulputate odio ut enim blandit volutpat maecenas. Eget
          egestas purus viverra accumsan in. Volutpat diam ut venenatis tellus
          in. Ut faucibus pulvinar elementum integer enim neque volutpat ac.
        </Text>
      </Stack>
      <Stack grow>
        <Card>
          <Heading level={4}>Wow, a card</Heading>
          <Text>
            Nisl condimentum id venenatis a condimentum vitae sapien
            pellentesque habitant.
          </Text>
          <Heading level={5}>Lil' stacked text</Heading>
          <Text>I am a stacked text, short and stout.</Text>
          <Heading level={5}>Another lil' stack text</Heading>
          <Text>Also a stacked text, still short and stout.</Text>
        </Card>
        <Card>
          <Heading level={4}>For the heck of it</Heading>
          <Text>
            Adipiscing elit ut aliquam purus. Viverra maecenas accumsan lacus
            vel facilisis volutpat est.
          </Text>
          <Heading level={5}>Wow, another lil' stacked text</Heading>
          <Text>Wow, this doesn't end, does it?</Text>
          <Heading level={5}>Another lil' stack text</Heading>
          <Text>Also a stacked text, still short and stout.</Text>
        </Card>
        <Card>
          <Heading level={5}>Disclaimer:</Heading>
          <Text size="xs">
            Acme organization is not liable for anything, literally. Because it
            is fake.
          </Text>
          <Text size="sm">
            But seriously, this is just a demo, so don't take it too seriously.
          </Text>
          <Text size="md">
            But if you do, please contact us directly at support@airplane.dev.
          </Text>
          <Text size="lg">
            We are always happy to hear from our users. Except if you are a bot.
          </Text>
          <Text size="xl">
            We don't like bots. They are mean and they steal our cookies. And
            they are not even real.
          </Text>
        </Card>
      </Stack>
    </Stack>
  );
};

export default {
  title: "Typography",
  component: Typography,
} as Meta<typeof Typography>;

export const Default = () => <Typography />;
