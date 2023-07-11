import { getRunErrorMessage } from "components/errorBoundary/ComponentErrorState";
import { describeExpectError } from "test-utils/describeExpectError";
import { render, waitFor, screen } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

import { Chart } from "./Chart";

describe("Chart", () => {
  const data = {
    x: [0, 1, 2],
    "User Count": [100, 101, 102],
  };
  it("renders Chart", async () => {
    const { container, getByText } = render(
      <Chart type="line" data={data} title="My Chart" />,
    );
    await waitFor(async () =>
      expect(container.querySelector(".js-plotly-plot")).toBeTruthy(),
    );
    expect(getByText("My Chart")).toBeVisible();
    expect(getByText("User Count")).toBeVisible();
  });

  describe("task query", () => {
    const mockCallback = jest.fn();
    beforeEach(() => {
      mockCallback.mockClear();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TestC = <TOutput,>(props: Record<string, any>) => {
      return (
        <>
          <Chart<{ foo: string }, TOutput>
            type="line"
            id="myChart"
            title="My Chart"
            task={{
              slug: "myTask",
              params: { foo: "bar" },
              onSuccess: mockCallback,
            }}
            {...props}
          />
        </>
      );
    };

    it("gets data from query", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      const { container, findByText } = render(<TestC />);

      await waitFor(async () =>
        expect(container.querySelector(".js-plotly-plot")).toBeTruthy(),
      );
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      await findByText("My Chart");
      await findByText("User Count");
    });

    it("transforms data", async () => {
      executeTaskSuccess({
        output: data,
        expectedParamValues: { foo: "bar" },
      });

      const { container, findByText } = render(
        <TestC
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          outputTransform={(output: any) => ({
            x: output.x,
            "Member Count": output["User Count"],
          })}
        />,
      );

      await waitFor(async () =>
        expect(container.querySelector(".js-plotly-plot")).toBeTruthy(),
      );
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      await findByText("My Chart");
      await findByText("Member Count");
    });

    it("unwraps Q1", async () => {
      executeTaskSuccess({
        output: { Q1: data },
        expectedParamValues: { foo: "bar" },
      });

      const { container, findByText } = render(<TestC />);

      await waitFor(async () =>
        expect(container.querySelector(".js-plotly-plot")).toBeTruthy(),
      );
      await waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
      await findByText("My Chart");
      await findByText("User Count");
    });

    describeExpectError(() => {
      it("query errors", async () => {
        executeTaskFail();

        render(<TestC />);

        await screen.findByText(getRunErrorMessage("myTask"));
      });
    });

    describeExpectError(() => {
      it("shows error modal with latest run when component errors", async () => {
        executeTaskSuccess({
          output: data,
          expectedParamValues: { foo: "bar" },
        });

        render(
          <TestC
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            outputTransform={(data: any) =>
              // @ts-expect-error
              data.Q7.map((d) => ({ ...d, name: "test" }))
            }
          />,
        );
        await screen.findAllByRole("dialog");
        await screen.findByText("Something went wrong in the Chart component");
        await screen.findByText("Stack trace");
        await screen.findByText("Component stack trace");
        await screen.findByText("Latest run");
      });
    });
  });
});
