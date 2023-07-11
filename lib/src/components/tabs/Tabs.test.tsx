import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Button } from "components/button/Button";
import { useRouter } from "routing";
import { TabsState, useComponentState } from "state";
import { render, screen } from "test-utils/react";

import { Tabs } from "./Tabs";

const ExampleTabs = () => (
  <>
    <Tabs.Tab value="gallery" label="Gallery" data-testid="gallerytab">
      Gallery tab content
    </Tabs.Tab>
    <Tabs.Tab value="messages" label="Messages" data-testid="messagestab">
      Messages tab content
    </Tabs.Tab>
    <Tabs.Tab value="settings" label="Settings" data-testid="settingstab">
      Settings tab content
    </Tabs.Tab>
  </>
);

describe("Tabs", () => {
  it("works as a controlled component", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string>("gallery");
      return (
        <>
          <Tabs value={value} onTabChange={(v) => setValue(v)}>
            <ExampleTabs />
          </Tabs>
          <button
            onClick={() => setValue("messages")}
            data-testid="changeButton"
          >
            button
          </button>
        </>
      );
    };
    render(<TestC />);

    const galleryTab = await screen.findByTestId<HTMLButtonElement>(
      "gallerytab",
    );
    const messagesTab = await screen.findByTestId<HTMLButtonElement>(
      "messagestab",
    );

    expect(galleryTab).toHaveAttribute("aria-selected", "true");
    expect(messagesTab).toHaveAttribute("aria-selected", "false");

    const button = await screen.findByTestId<HTMLButtonElement>("changeButton");
    await userEvent.click(button);

    expect(galleryTab).toHaveAttribute("aria-selected", "false");
    expect(messagesTab).toHaveAttribute("aria-selected", "true");

    await userEvent.click(galleryTab);

    expect(galleryTab).toHaveAttribute("aria-selected", "true");
    expect(messagesTab).toHaveAttribute("aria-selected", "false");
  });

  it("unselects all tabs if value is null", async () => {
    const TestC = () => {
      const [value, setValue] = useState<string | null>("gallery");
      return (
        <>
          <Tabs value={value} defaultValue="gallery">
            <ExampleTabs />
          </Tabs>
          <button onClick={() => setValue(null)}>Set null</button>
        </>
      );
    };
    render(<TestC />);

    const galleryTab = await screen.findByTestId<HTMLButtonElement>(
      "gallerytab",
    );
    expect(galleryTab).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByText("Set null"));
    const messagesTab = await screen.findByTestId<HTMLButtonElement>(
      "messagestab",
    );
    const settingsTab = await screen.findByTestId<HTMLButtonElement>(
      "settingstab",
    );
    expect(galleryTab).toHaveAttribute("aria-selected", "false");
    expect(messagesTab).toHaveAttribute("aria-selected", "false");
    expect(settingsTab).toHaveAttribute("aria-selected", "false");
  });

  it("works as an uncontrolled component", async () => {
    const TestC = () => {
      const inputState = useComponentState<TabsState>();
      return (
        <>
          <Tabs id={inputState.id} defaultValue="gallery">
            <ExampleTabs />
          </Tabs>
          <div>{`Value: ${inputState.value}`}</div>
          <button
            onClick={() => {
              inputState.setValue("messages");
            }}
            data-testid="changeButton"
          >
            button
          </button>
        </>
      );
    };
    render(<TestC />);

    const galleryTab = await screen.findByTestId<HTMLButtonElement>(
      "gallerytab",
    );
    const messagesTab = await screen.findByTestId<HTMLButtonElement>(
      "messagestab",
    );

    expect(galleryTab).toHaveAttribute("aria-selected", "true");
    expect(messagesTab).toHaveAttribute("aria-selected", "false");

    await screen.findByText("Value: gallery");

    const button = await screen.findByTestId<HTMLButtonElement>("changeButton");
    await userEvent.click(button);

    expect(galleryTab).toHaveAttribute("aria-selected", "false");
    expect(messagesTab).toHaveAttribute("aria-selected", "true");

    await screen.findByText("Value: messages");

    const settingsTab = await screen.findByTestId<HTMLButtonElement>(
      "settingstab",
    );
    expect(settingsTab).toHaveAttribute("aria-selected", "false");
    await userEvent.click(settingsTab);

    expect(galleryTab).toHaveAttribute("aria-selected", "false");
    expect(messagesTab).toHaveAttribute("aria-selected", "false");
    expect(settingsTab).toHaveAttribute("aria-selected", "true");
  });

  describe("routing", () => {
    beforeEach(() => {
      // window state is shared for tests in the same file, so we need to reset it before each test.
      window.location.replace("");
    });

    it("updates the route when a tab is clicked", async () => {
      const TestC = () => (
        <Tabs routingKey="tab">
          <ExampleTabs />
        </Tabs>
      );
      render(<TestC />);

      const galleryTab = await screen.findByTestId<HTMLButtonElement>(
        "gallerytab",
      );
      await userEvent.click(galleryTab);
      expect(window.location.hash).toBe("#tab=gallery");
    });

    it("sets tab state based on the URL", async () => {
      window.location.replace("#tab=settings");
      const TestC = () => (
        <Tabs routingKey="tab">
          <ExampleTabs />
        </Tabs>
      );
      render(<TestC />);

      const settingsTab = await screen.findByTestId<HTMLButtonElement>(
        "settingstab",
      );
      expect(settingsTab).toHaveAttribute("aria-selected", "true");
    });

    it("updates route with multiple tab groups", async () => {
      const TestC = () => {
        return (
          <>
            <Tabs routingKey="myTab">
              <Tabs.Tab value="a" label="A" data-testid="A">
                A
              </Tabs.Tab>
              <Tabs.Tab value="b" label="B" data-testid="B">
                B
              </Tabs.Tab>
            </Tabs>
            <Tabs routingKey="otherTab">
              <Tabs.Tab value="c" label="C" data-testid="C">
                C
              </Tabs.Tab>
            </Tabs>
          </>
        );
      };
      render(<TestC />);

      await userEvent.click(await screen.findByTestId("B"));
      expect(window.location.hash).toBe(`#myTab=b`);

      await userEvent.click(await screen.findByTestId("C"));
      expect(window.location.hash).toBe(`#myTab=b&otherTab=c`);

      await userEvent.click(await screen.findByTestId("A"));
      expect(window.location.hash).toBe(`#myTab=a&otherTab=c`);
    });

    it("updates route with manual navigate call", async () => {
      const TestC = () => {
        const router = useRouter();
        return (
          <>
            <Tabs routingKey="tab">
              <ExampleTabs />
            </Tabs>
            <Button
              onClick={() => {
                router.navigate({ params: { tab: "messages" } });
              }}
            >
              Click me
            </Button>
          </>
        );
      };
      render(<TestC />);

      const galleryTab = await screen.findByTestId<HTMLButtonElement>(
        "gallerytab",
      );
      const messagesTab = await screen.findByTestId<HTMLButtonElement>(
        "messagestab",
      );

      await userEvent.click(galleryTab);
      expect(galleryTab).toHaveAttribute("aria-selected", "true");
      expect(messagesTab).toHaveAttribute("aria-selected", "false");

      await userEvent.click(screen.getByText("Click me"));
      expect(galleryTab).toHaveAttribute("aria-selected", "false");
      expect(messagesTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
