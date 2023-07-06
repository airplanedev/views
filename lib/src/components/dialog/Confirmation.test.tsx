import userEvent from "@testing-library/user-event";

import { Button } from "components/button/Button";
import { DialogState, useComponentState } from "state";
import { render, screen } from "test-utils/react";

import { Confirmation } from "./Confirmation";

describe("Confirmation", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  beforeEach(() => {
    mockOnClose.mockReset();
    mockOnConfirm.mockReset();
  });
  describe("controlled component", () => {
    it("can be used as a controlled component", async () => {
      render(
        <Confirmation
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="title"
        >
          <div>hi</div>
        </Confirmation>,
      );

      const confirm = await screen.findByText("Confirm");
      const cancel = await screen.findByText("Cancel");
      await screen.findByText("hi");
      await screen.findByText("title");

      await userEvent.click(confirm);
      expect(mockOnConfirm.mock.calls.length).toBe(1);
      await userEvent.click(cancel);
      expect(mockOnClose.mock.calls.length).toBe(1);
    });

    it("custom cancel and confirm text", async () => {
      render(
        <Confirmation
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          confirmText="yeet"
          cancelText="neet"
        />,
      );

      const confirm = await screen.findByText("yeet");
      const cancel = await screen.findByText("neet");

      await userEvent.click(confirm);
      expect(mockOnConfirm.mock.calls.length).toBe(1);
      await userEvent.click(cancel);
      expect(mockOnClose.mock.calls.length).toBe(1);
    });
  });
  describe("component state", () => {
    it("opens and closes from component state", async () => {
      const TestC = () => {
        const state = useComponentState<DialogState>("myConfirmation");
        return (
          <>
            <Confirmation
              id="myConfirmation"
              onConfirm={mockOnConfirm}
              title="myConfirmation"
            />
            <Button
              onClick={() => {
                if (state.opened) {
                  state.close();
                } else {
                  state.open();
                }
              }}
            >
              {String(state.opened)}
            </Button>
          </>
        );
      };
      render(<TestC />);

      let button = await screen.findByText("false");
      expect(screen.queryByText("myConfirmation")).toBeFalsy();

      await userEvent.click(button);
      expect(screen.queryByText("myConfirmation")).toBeTruthy();

      button = await screen.findByText("true");
      await userEvent.click(button);
      expect(screen.queryByText("myConfirmation")).toBeFalsy();

      button = await screen.findByText("false");
      await userEvent.click(button);
      expect(screen.queryByText("myConfirmation")).toBeTruthy();

      const cancel = await screen.findByText("Cancel");
      await userEvent.click(cancel);
      button = await screen.findByText("false");
      expect(screen.queryByText("myConfirmation")).toBeFalsy();
    });
  });
});
