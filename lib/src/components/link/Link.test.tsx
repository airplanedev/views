import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { useState } from "react";

import { server } from "client/test-utils/mock";
import { Button } from "components/button/Button";
import { render, waitFor } from "test-utils/react";

import { Link } from "./Link";

describe("Link", () => {
  it("should render", async () => {
    const { findByText } = render(
      <Link href="https://www.google.com">Google</Link>,
    );
    const link = await findByText("Google");
    expect(link.getAttribute("href")).toBe("https://www.google.com");
  });

  it("should open link in new tab", async () => {
    const { findByText } = render(
      <Link href="https://www.google.com" newTab>
        Google
      </Link>,
    );
    const link = await findByText("Google");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("should update link", async () => {
    const TestC = () => {
      const [href, setHref] = useState("https://www.google.com");
      const [name, setName] = useState("Google");
      return (
        <>
          <Link href={href}>{name}</Link>
          <Button
            onClick={() => {
              setName("Bing");
              setHref("https://www.bing.com");
            }}
          >
            Change
          </Button>
        </>
      );
    };
    const { findByText } = render(<TestC />);

    let link = await findByText("Google");
    expect(link.getAttribute("href")).toBe("https://www.google.com");

    userEvent.click(await findByText("Change"));
    link = await findByText("Bing");
    await waitFor(() => {
      expect(link.getAttribute("href")).toBe("https://www.bing.com");
    });
  });

  it("navigates to a task", async () => {
    server.use(
      rest.get("http://api/v0/tasks/getMetadata", (_, res, ctx) => {
        return res(ctx.json({ id: "tsk123" }));
      }),
      rest.get("http://api/v0/hosts/web", (_, res, ctx) => {
        return res(ctx.json("host"));
      }),
    );

    const { findByText } = render(
      <Link href={{ task: "myTask", params: { foo: "bar" } }}>Google</Link>,
    );
    await waitFor(async () => {
      const link = await findByText("Google");
      expect(link.getAttribute("href")).toBe("host/tasks/tsk123?foo=bar");
    });
  });
});
