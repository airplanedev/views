import { Meta, StoryFn } from "@storybook/react";

import { ComponentErrorBoundary, Props } from "./ComponentErrorBoundary";

export default {
  title: "ComponentErrorBoundary",
  component: ComponentErrorBoundary,
} as Meta<typeof ComponentErrorBoundary>;

const Template: StoryFn<Props> = (args: any) => (
  <ComponentErrorBoundary {...args}>
    <ErrorC />
  </ComponentErrorBoundary>
);

export const Simple = Template.bind({});
Simple.parameters = {
  chromatic: { disableSnapshot: true },
};

const Fallback = () => {
  return <div>something went wrong</div>;
};
export const CustomFallback = Template.bind({});
CustomFallback.args = {
  fallback: <Fallback />,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorC = ({ no }: any) => {
  if (no.no) {
    return null;
  }
  return null;
};

export const WithLatestRun = Template.bind({});
WithLatestRun.parameters = {
  chromatic: { disableSnapshot: true },
};
WithLatestRun.args = {
  latestRun: {
    runID: "devrun8wo4n79nk4",
    output: {
      Q1: [
        {
          id: 0,
          company_name: "Future Golf Partners",
          country: "Brazil",
          signup_date: "2020-03-21T04:48:23.532Z",
        },
        {
          id: 1,
          company_name: "Amalgamated Star LLC",
          country: "Canada",
          signup_date: "2020-07-16T00:40:30.103Z",
        },
      ],
    },
  },
};

export const WithLatestRunError = Template.bind({});
WithLatestRunError.parameters = {
  chromatic: { disableSnapshot: true },
};
WithLatestRunError.args = {
  latestRun: {
    runID: "devrun8wo4n79nk4",
    error: {
      message: `ErrBadRequest: Error parsing query: syntax error at or near "FROM":
    SELECT
        id,
        company_name,
        country,
        signup_date,
    FROM
        accounts
    ORDER BY
        id`,
      type: "FAILED",
    },
    output: {
      error:
        'ErrBadRequest: Error parsing query: syntax error at or near "FROM":\nSELECT\n    id,\n    company_name,\n    country,\n    signup_date,\nFROM\n    accounts\nORDER BY\n    id',
    },
  },
};
