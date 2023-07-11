import { render } from "test-utils/react";
import { executeTaskSuccess } from "test-utils/tasks/executeTaskTestUtils";

import { DescriptionList } from "./DescriptionList";

describe("DescriptionList", () => {
  it("displays items", async () => {
    const { findByText } = render(
      <DescriptionList items={[{ term: "One", description: "1" }]} />,
    );

    await findByText("One");
    await findByText("1");
  });

  describe("with query", () => {
    it("query returns items", async () => {
      executeTaskSuccess({
        output: [{ term: "One", description: "1" }],
        expectedParamValues: { foo: "bar" },
      });

      const { findByText } = render(
        <DescriptionList task={{ slug: "myTask", params: { foo: "bar" } }} />,
      );

      await findByText("One");
      await findByText("1");
    });

    it("query returns object", async () => {
      executeTaskSuccess({
        output: { One: "1" },
        expectedParamValues: { foo: "bar" },
      });

      const { findByText } = render(
        <DescriptionList task={{ slug: "myTask", params: { foo: "bar" } }} />,
      );

      await findByText("One");
      await findByText("1");
    });

    it("query returns nested items", async () => {
      executeTaskSuccess({
        output: { Q1: [{ term: "One", description: "1" }] },
        expectedParamValues: { foo: "bar" },
      });

      const { findByText } = render(
        <DescriptionList task={{ slug: "myTask", params: { foo: "bar" } }} />,
      );

      await findByText("One");
      await findByText("1");
    });

    it("query plus outputTransform", async () => {
      executeTaskSuccess({ output: [{ notTerm: "1" }] });

      const { findByText } = render(
        <DescriptionList
          task={{ slug: "myTask" }}
          outputTransform={(o) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            o.map((item: any) => ({
              term: "One",
              description: item.notTerm,
            }))
          }
        />,
      );

      await findByText("One");
      await findByText("1");
    });

    it("query plus outputTransform with nested data", async () => {
      executeTaskSuccess({
        output: { Q1: [{ term: "One", description: "1" }] },
      });

      const { findByText } = render(
        <DescriptionList
          task={{ slug: "myTask" }}
          outputTransform={(o) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            o.map((item: any) => ({ ...item, term: item.term.toUpperCase() }))
          }
        />,
      );

      await findByText("ONE");
      await findByText("1");
    });

    it("query returns incorrect format", async () => {
      executeTaskSuccess({
        output: [{ notTerm: "not description" }],
        expectedParamValues: { foo: "bar" },
      });

      const { findByText } = render(
        <DescriptionList task={{ slug: "myTask", params: { foo: "bar" } }} />,
      );

      await findByText("Something went wrong in the DescriptionList component");
    });
  });
});
