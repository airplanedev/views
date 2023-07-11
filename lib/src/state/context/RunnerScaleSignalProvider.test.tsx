import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { useContext } from "react";

import { server } from "client/test-utils/mock";
import { Button } from "components/button/Button";
import { render, screen } from "test-utils/react";

import {
  RunnerScaleSignalContext,
  RunnerScaleSignalProvider,
} from "./RunnerScaleSignalProvider";

describe("RunnerScaleSignalProvider", () => {
  it("throttles same requests", async () => {
    const mockFn = jest.fn();
    server.use(
      rest.post("http://api/v0/runners/createScaleSignal", (req, res, ctx) => {
        mockFn();
        return res(ctx.json({}));
      }),
    );
    const TestC = () => {
      const { createScaleSignal } = useContext(RunnerScaleSignalContext);
      const onClickCreate = async () => {
        await createScaleSignal({
          signalKey: "test",
          expirationDurationSeconds: 300,
          taskSlug: "slug",
        });
      };
      return (
        <RunnerScaleSignalProvider>
          <Button onClick={onClickCreate}>Click</Button>
        </RunnerScaleSignalProvider>
      );
    };
    render(<TestC />);
    const button = await screen.findByRole("button", { name: "Click" });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(mockFn.mock.calls.length).toBe(1);
  });

  it("doesn't throttle different requests", async () => {
    const mockFn = jest.fn();
    server.use(
      rest.post("http://api/v0/runners/createScaleSignal", (req, res, ctx) => {
        mockFn();
        return res(ctx.json({}));
      }),
    );
    const TestC = () => {
      const { createScaleSignal } = useContext(RunnerScaleSignalContext);
      const onClickCreate1 = async () => {
        await createScaleSignal({
          signalKey: "test1",
          expirationDurationSeconds: 300,
          taskSlug: "slug",
        });
      };
      const onClickCreate2 = async () => {
        await createScaleSignal({
          signalKey: "test2",
          expirationDurationSeconds: 300,
          taskSlug: "slug",
        });
      };
      const onClickCreate3 = async () => {
        await createScaleSignal({
          signalKey: "test1",
          expirationDurationSeconds: 300,
          taskSlug: "slug3",
        });
      };
      return (
        <RunnerScaleSignalProvider>
          <Button onClick={onClickCreate1}>Click1</Button>
          <Button onClick={onClickCreate2}>Click2</Button>
          <Button onClick={onClickCreate3}>Click3</Button>
        </RunnerScaleSignalProvider>
      );
    };
    render(<TestC />);
    const button1 = await screen.findByRole("button", { name: "Click1" });
    const button2 = await screen.findByRole("button", { name: "Click2" });
    const button3 = await screen.findByRole("button", { name: "Click3" });
    await userEvent.click(button1);
    await userEvent.click(button2);
    await userEvent.click(button3);
    await userEvent.click(button1);
    await userEvent.click(button2);
    await userEvent.click(button3);
    expect(mockFn.mock.calls.length).toBe(3);
  });
});
