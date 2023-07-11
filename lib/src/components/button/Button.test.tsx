import userEvent from "@testing-library/user-event";
import airplane from "airplane";
import { useState } from "react";

import { Button } from "components/button/Button";
import { RequestRunnableDialog } from "components/requestDialog/RequestRunnableDialog";
import { getRoutingCalls } from "routing/routerTestUtils";
import { ButtonState, useComponentState } from "state";
import { describeExpectError } from "test-utils/describeExpectError";
import {
  setupTaskAndRunbookPermissions,
  setupTaskPermissionsFail,
} from "test-utils/permissions/permissionsTestUtils";
import { render, screen, waitFor } from "test-utils/react";
import {
  executeRunbookFail,
  executeRunbookSuccess,
  executeTaskFail,
  executeTaskSuccess,
} from "test-utils/tasks/executeTaskTestUtils";

jest.mock("components/requestDialog/RequestRunnableDialog", () => ({
  RequestRunnableDialog: jest.fn(),
}));

describe("Button", () => {
  beforeEach(() => {
    setupTaskAndRunbookPermissions();
  });

  it("executes task on click", async () => {
    executeTaskSuccess({
      output: "output",
      expectedParamValues: { foo: "bar" },
    });
    const mockOnClick = jest.fn();
    const TestC = () => {
      const buttonState = useComponentState("taskButton");
      return (
        <>
          <Button
            id="taskButton"
            task={{ slug: "slug", params: { foo: "bar" } }}
            onClick={mockOnClick}
          >
            Click!
          </Button>
          <div>Output: {buttonState?.result?.output}</div>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await screen.findByText("Output: output");
    expect(mockOnClick).toHaveBeenCalled();
  });

  describeExpectError(() => {
    it("executes task with permission check failure", async () => {
      const permissionsCheck = jest.fn();
      setupTaskPermissionsFail(permissionsCheck);
      executeTaskSuccess({
        output: "output",
        expectedParamValues: { foo: "bar" },
      });
      const mockOnClick = jest.fn();
      const TestC = () => {
        const buttonState = useComponentState("taskButton");
        return (
          <>
            <Button
              id="taskButton"
              task={{ slug: "slug", params: { foo: "bar" } }}
              onClick={mockOnClick}
            >
              Click!
            </Button>
            <div>Output: {buttonState?.result?.output}</div>
          </>
        );
      };

      render(<TestC />);

      await waitFor(() => expect(permissionsCheck).toHaveBeenCalled());
      const button = await screen.findByRole("button", { name: "Click!" });
      await userEvent.click(button);
      await screen.findByText("Output: output");
      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  it("executes runbook on click", async () => {
    executeRunbookSuccess({
      expectedParamValues: { foo: "bar" },
    });
    const mockOnClick = jest.fn();
    const TestC = () => {
      const buttonState =
        useComponentState<ButtonState<{ sessionID: number }>>("runbookButton");
      return (
        <>
          <Button
            id="runbookButton"
            runbook={{ slug: "slug", params: { foo: "bar" } }}
            onClick={mockOnClick}
          >
            Click!
          </Button>
          <div>{JSON.stringify(buttonState?.result)}</div>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await screen.findByText(`{"sessionID":"1"}`);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("executes runbook on click with only slug", async () => {
    executeRunbookSuccess();
    const mockOnClick = jest.fn();
    const TestC = () => {
      return (
        <>
          <Button id="runbookButton" runbook="slug" onClick={mockOnClick}>
            Click!
          </Button>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("executes task from airplane fn", async () => {
    const myTask = airplane.task(
      {
        slug: "task",
        parameters: {
          foo: {
            type: "shorttext",
          },
        },
      },
      (params) => {
        return "";
      },
    );
    executeTaskSuccess({
      output: "output",
      expectedParamValues: { foo: "bar" },
    });
    const mockOnClick = jest.fn();
    const TestC = () => {
      const buttonState = useComponentState("taskButton");
      return (
        <>
          <Button
            id="taskButton"
            task={{ fn: myTask, params: { foo: "bar" } }}
            onClick={mockOnClick}
          >
            Click!
          </Button>
          <div>Output: {buttonState?.result?.output}</div>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await screen.findByText("Output: output");
    expect(mockOnClick).toHaveBeenCalled();
  });

  it("errors on task failure", async () => {
    executeTaskFail();
    const TestC = () => {
      const buttonState = useComponentState("taskButton");
      return (
        <>
          <Button
            id="taskButton"
            task={{ slug: "slug", params: { foo: "bar" } }}
          >
            Click!
          </Button>
          <div>
            Output: {JSON.stringify(buttonState?.result?.output)} Error:{" "}
            {buttonState?.result?.error.message}
          </div>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await screen.findByText('Output: {"error":"error"} Error: error');
  });

  it("errors on runbook failure", async () => {
    executeRunbookFail();
    const TestC = () => {
      const buttonState = useComponentState<ButtonState>("runbookButton");
      return (
        <>
          <Button
            id="runbookButton"
            runbook={{ slug: "slug", params: { foo: "bar" } }}
          >
            Click!
          </Button>
          <div>{buttonState?.result?.error?.message}</div>
        </>
      );
    };

    render(<TestC />);

    const button = await screen.findByRole("button", { name: "Click!" });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
    await screen.findByText("Session failed");
  });

  it("can be a link button", async () => {
    render(<Button href="https://www.airplane.dev">button</Button>);

    expect(screen.getByText("button").closest("a")).toHaveAttribute(
      "href",
      "https://www.airplane.dev",
    );
  });

  it("can be a link button that links to a view", async () => {
    getRoutingCalls();
    render(
      <Button href={{ view: "myView", params: { foo: "bar" } }}>button</Button>,
    );
    await waitFor(() =>
      expect(screen.getByText("button").closest("a")).toHaveAttribute(
        "href",
        "https://app.airplane.dev/views/id?foo=bar",
      ),
    );
  });

  it("updates href correctly", async () => {
    const TestC = () => {
      const [href, setHref] = useState("https://www.airplane.dev");
      return (
        <>
          <Button
            onClick={() => {
              setHref("https://web.airstage.app");
            }}
          >
            Change href
          </Button>
          <Button href={href}>button</Button>
        </>
      );
    };

    render(<TestC />);

    expect(screen.getByText("button").closest("a")).toHaveAttribute(
      "href",
      "https://www.airplane.dev",
    );

    await userEvent.click(screen.getByText("Change href"));

    expect(screen.getByText("button").closest("a")).toHaveAttribute(
      "href",
      "https://web.airstage.app",
    );
  });

  describe("confirmation", () => {
    it("cancels and confirms", async () => {
      const mockOnClick = jest.fn();

      render(
        <Button onClick={mockOnClick} confirm>
          button
        </Button>,
      );

      const button = await screen.findByText("button");

      await userEvent.click(button);
      await screen.findByText("Are you sure?");
      const cancel = await screen.findByText("Cancel");
      await userEvent.click(cancel);
      expect(mockOnClick).not.toHaveBeenCalled();
      expect(screen.queryByText("Are you sure?")).toBeFalsy();

      await userEvent.click(button);
      const confirm = await screen.findByText("Confirm");
      await userEvent.click(confirm);
      expect(mockOnClick).toHaveBeenCalled();
      expect(screen.queryByText("Are you sure?")).toBeFalsy();
    });

    it("cancels and confirms with custom config", async () => {
      const mockOnClick = jest.fn();

      render(
        <Button
          onClick={mockOnClick}
          confirm={{
            title: "Title",
            cancelText: "Nope",
            confirmText: "Yup",
            body: "Body",
          }}
        >
          button
        </Button>,
      );

      const button = await screen.findByText("button");

      await userEvent.click(button);
      await screen.findByText("Title");
      await screen.findByText("Body");
      const cancel = await screen.findByText("Nope");
      await userEvent.click(cancel);
      expect(mockOnClick).not.toHaveBeenCalled();
      expect(screen.queryByText("Title")).toBeFalsy();

      await userEvent.click(button);
      const confirm = await screen.findByText("Yup");
      await userEvent.click(confirm);
      expect(mockOnClick).toHaveBeenCalled();
      expect(screen.queryByText("Title")).toBeFalsy();
    }, 10000);

    it("cancels and confirms task execution", async () => {
      executeTaskSuccess({
        output: "output",
      });

      render(
        <Button confirm task="myTask">
          button
        </Button>,
      );

      const button = await screen.findByRole("button");
      await waitFor(() => expect(button).not.toBeDisabled());

      await userEvent.click(button);
      await screen.findByText("myTask");
      await screen.findByText("Are you sure you want to run");
      const cancel = await screen.findByText("Cancel");
      await userEvent.click(cancel);
      expect(screen.queryByText("Are you sure you want to run")).toBeFalsy();

      await userEvent.click(button);
      await screen.findByText("Are you sure you want to run");
      const confirm = await screen.findByText("Run");
      await userEvent.click(confirm);
      expect(screen.queryByText("Are you sure you want to run")).toBeFalsy();
    }, 10000);

    it("cancels and confirms task execution with custom config", async () => {
      executeTaskSuccess({
        output: "output",
      });

      render(
        <Button
          confirm={{
            title: "Title",
            confirmText: "Confirm",
            body: "Do a thing",
          }}
          task="myTask"
        >
          button
        </Button>,
      );

      const button = await screen.findByText("button");
      await waitFor(async () => {
        await userEvent.click(button);
      });

      await screen.findByText("Title");
      await screen.findByText("Do a thing");
      const cancel = await screen.findByText("Cancel");
      await userEvent.click(cancel);
      expect(screen.queryByText("Title")).toBeFalsy();

      await userEvent.click(button);
      const confirm = await screen.findByText("Confirm");
      await userEvent.click(confirm);
      expect(screen.queryByText("Title")).toBeFalsy();
    }, 10000);
  });
});

describe("Request Task Dialog", () => {
  beforeEach(() => {
    setupTaskAndRunbookPermissions({ execute: false, request: true });
  });
  it("opens dialog with task request perms", async () => {
    render(
      <Button task={{ slug: "slug", params: { foo: "bar" } }}>Click!</Button>,
    );
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
    await userEvent.click(screen.getByRole("button", { name: "Click!" }));

    expect(RequestRunnableDialog).toHaveBeenCalledWith(
      {
        opened: true,
        onSubmit: expect.anything(),
        onClose: expect.anything(),
        taskSlug: "slug",
        paramValues: { foo: "bar" },
      },
      expect.anything(),
    );
  });

  it("opens dialog with runbook request perms", async () => {
    render(
      <Button runbook={{ slug: "slug", params: { foo: "bar" } }}>
        Click!
      </Button>,
    );
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
    await userEvent.click(screen.getByRole("button", { name: "Click!" }));

    expect(RequestRunnableDialog).toHaveBeenCalledWith(
      {
        opened: true,
        onSubmit: expect.anything(),
        onClose: expect.anything(),
        runbookSlug: "slug",
        paramValues: { foo: "bar" },
      },
      expect.anything(),
    );
  });
});
