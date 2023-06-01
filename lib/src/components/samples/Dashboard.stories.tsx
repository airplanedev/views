import { Meta } from "@storybook/react";

import { Card } from "components/card/Card";
import { Container } from "components/Container";
import { Divider } from "components/divider/Divider";
import { Heading } from "components/heading/Heading";
import { Select } from "components/select/Select";
import { Stack } from "components/stack/Stack";
import { Table } from "components/table/Table";
import {
  createRandomProducts,
  Product,
  PRODUCT_COLUMNS,
} from "components/table/testdata";
import { Text } from "components/text/Text";

export const Dashboard = () => {
  return (
    <Stack direction="column" grow>
      <Text>
        <Heading>Store inventory manager</Heading>
        View and manage the inventory for your stores.
      </Text>
      <Select
        label="Select store"
        data={["San Francisco", "Manhattan", "Brooklyn"]}
      />
      <Divider />
      <Stack grow>
        <Stack direction="column" grow>
          <Table<Product>
            columns={PRODUCT_COLUMNS}
            data={createRandomProducts(5)}
          />
        </Stack>
        <Stack direction="column">
          <Card>
            <Text>
              <Heading level={2}>Store details</Heading>
              View and manage the inventory for your stores.
            </Text>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default {
  title: "Samples/Dashboard",
  component: Dashboard,
} as Meta<typeof Dashboard>;

export const DashboardInContainer = () => (
  // This container simulates the same container we wrap our views in so we can test what it looks via storybook
  // https://github.com/airplanedev/lib/blob/main/pkg/build/views/main.tsx
  <Container size="xl" p="xl">
    <Dashboard />
  </Container>
);
