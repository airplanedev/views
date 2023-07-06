import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { getRunErrorMessage } from "components/errorBoundary/ComponentErrorState";
import { MultiSelectState, useComponentState } from "state";
import { describeExpectError } from "test-utils/describeExpectError";
import { render, screen, waitFor } from "test-utils/react";
import {
  executeTaskFail,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

import { MultiSelect } from "./MultiSelect";

describe("MultiSelect", () => {
  it("selects strings", async () => {
    const TestC = () => {
      const [value, setValue] = useState<Array<string | number>>([]);
      return (
        <>
          <MultiSelect
            data={["One", "Two", "Three"]}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue(["Two", "Three"])}>button</button>
          {`Value: ${value.join(",")}`}
        </>
      );
    };

    const { findByText, findByLabelText } = render(<TestC />);
    const ms = await findByLabelText("selectMe");
    userEvent.click(ms);

    userEvent.click(await findByText("One"));
    await findByText("Value: One");

    userEvent.click(await findByText("Two"));
    await findByText("Value: One,Two");

    userEvent.click(await findByText("button"));
    await findByText("Value: Two,Three");
  });

  it("selects numbers", async () => {
    const TestC = () => {
      const [value, setValue] = useState<Array<string | number>>([]);
      return (
        <>
          <MultiSelect
            data={[1, 2, 3]}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue([2, 3])}>button</button>
          {`Value: ${value.join(",")}`}
        </>
      );
    };

    const { findByText, findByLabelText } = render(<TestC />);
    const ms = await findByLabelText("selectMe");
    userEvent.click(ms);

    userEvent.click(await findByText("1"));
    await findByText("Value: 1");

    userEvent.click(await findByText("2"));
    await findByText("Value: 1,2");

    userEvent.click(await findByText("button"));
    await findByText("Value: 2,3");
  });

  it("selects MultiSelectItem", async () => {
    const TestC = () => {
      const [value, setValue] = useState<Array<string | number>>([]);
      return (
        <>
          <MultiSelect
            data={[
              { value: 1, label: "One" },
              { value: 2, label: "Two" },
              { value: 3, label: "Three" },
            ]}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue([2, 3])}>button</button>
          {`Value: ${value.join(",")}`}
        </>
      );
    };

    const { findByText, findByLabelText } = render(<TestC />);
    const ms = await findByLabelText("selectMe");
    userEvent.click(ms);

    userEvent.click(await findByText("One"));
    await findByText("Value: 1");

    userEvent.click(await findByText("Two"));
    await findByText("Value: 1,2");

    userEvent.click(await findByText("button"));
    await findByText("Value: 2,3");
  });

  it("connects to the component state", async () => {
    const TestC = () => {
      const { id, value, setValue } = useComponentState<MultiSelectState>();
      return (
        <>
          <MultiSelect
            defaultValue={["One"]}
            data={["One", "Two", "Three"]}
            id={id}
            value={value}
            onChange={setValue}
            label="selectMe"
          />
          <button onClick={() => setValue(["Two", "Three"])}>button</button>
          {value ? `Value: ${value.join(",")}` : ""}
        </>
      );
    };

    const { findByText, findByLabelText } = render(<TestC />);
    await findByText("Value: One");

    const ms = await findByLabelText("selectMe");
    userEvent.click(ms);

    userEvent.click(await findByText("Two"));
    await findByText("Value: One,Two");

    userEvent.click(await findByText("button"));
    await findByText("Value: Two,Three");
  });

  describe("from task", () => {
    it("task succeeds with strings", async () => {
      const TestC = () => {
        const [value, setValue] = useState<Array<string | number>>([]);
        return (
          <>
            <MultiSelect
              task={{ slug: "myTask" }}
              value={value}
              onChange={setValue}
              label="selectMe"
            />
            {`Value: ${value.join(",")}`}
          </>
        );
      };
      executeTaskSuccess({ output: ["One", "Two"] });

      const { findByText, findByLabelText } = render(<TestC />);
      const ms = await findByLabelText("selectMe");
      userEvent.click(ms);

      userEvent.click(await findByText("One"));
      await findByText("Value: One");

      userEvent.click(await findByText("Two"));
      await findByText("Value: One,Two");
    });
  });

  describeExpectError(() => {
    it("query errors", async () => {
      executeTaskFail();

      render(<MultiSelect task={{ slug: "myTask", params: { foo: "bar" } }} />);

      await waitFor(async () => {
        await screen.findByText(getRunErrorMessage("myTask"));
      });
    });

    it("shows error modal with latest run when component errors", async () => {
      executeTaskSuccess({
        output: ["hi", "bye"],
        expectedParamValues: { foo: "bar" },
      });

      render(
        <MultiSelect
          task={{
            slug: "myTask",
            params: { foo: "bar" },
          }}
          outputTransform={(data: unknown) =>
            // @ts-expect-error
            data.Q7.map((d) => d.toUpperCase())
          }
        />,
      );
      await screen.findAllByRole("dialog");
      await screen.findByText(
        "Something went wrong in the MultiSelect component",
      );
      await screen.findByText("Stack trace");
      await screen.findByText("Component stack trace");
      await screen.findByText("Latest run");
    });
  });
});
