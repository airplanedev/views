import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { useState } from "react";

import { server } from "client/test-utils/mock";
import { render, screen, waitFor } from "test-utils/react";

import { RequestRunnableDialog } from "./RequestRunnableDialog";

const testCases = [
  {
    testName: "explicit permissions",
    setupFunc: () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                taskID: "tsk1",
                name: "Exit 1",
                slug: "exit_1",
                requireExplicitPermissions: true,
                triggers: [
                  {
                    kind: "form",
                    triggerID: "trg1",
                  },
                ],
              },
              reviewers: [{ userID: "usr1" }],
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/users/get", (_, res, ctx) => {
          return res(
            ctx.json({
              user: {
                userID: "usr1",
                name: "George Du",
                avatarURL: "",
              },
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/entities/search", (_, res, ctx) => {
          throw new Error("Should not be called");
        }),
      );
    },
    taskSlug: "exit_1",
  },
  {
    testName: "explicit permissions - user has no name",
    setupFunc: () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                taskID: "tsk1",
                name: "Exit 1",
                slug: "exit_1",
                requireExplicitPermissions: true,
                triggers: [
                  {
                    kind: "form",
                    triggerID: "trg1",
                  },
                ],
              },
              reviewers: [{ userID: "usr1" }],
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/users/get", (_, res, ctx) => {
          return res(
            ctx.json({
              user: {
                userID: "usr1",
                email: "George Du",
                avatarURL: "",
              },
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/entities/search", (_, res, ctx) => {
          throw new Error("Should not be called");
        }),
      );
    },
    taskSlug: "exit_1",
  },
  {
    testName: "no explicit permissions",
    setupFunc: () => {
      server.use(
        rest.get("http://api/v0/tasks/getTaskReviewers", (_, res, ctx) => {
          return res(
            ctx.json({
              task: {
                taskID: "tsk1",
                name: "Exit 1",
                slug: "exit_1",
                requireExplicitPermissions: false,
                triggers: [
                  {
                    kind: "form",
                    triggerID: "trg1",
                  },
                ],
              },
              reviewers: [{ userID: "usr1" }],
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/users/get", (_, res, ctx) => {
          return res(
            ctx.json({
              user: {
                userID: "unused",
                name: "unused",
                avatarURL: "unused",
              },
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/entities/search", (_, res, ctx) => {
          return res(
            ctx.json({
              results: [
                {
                  user: {
                    userID: "usr1",
                    name: "George Du",
                    avatarURL: "",
                  },
                },
              ],
            }),
          );
        }),
      );
    },
    taskSlug: "exit_1",
  },
  {
    testName: "explicit permissions runbook",
    setupFunc: () => {
      server.use(
        rest.get("http://api/v0/runbooks/get", (_, res, ctx) => {
          return res(
            ctx.json({
              runbook: {
                id: "rbk1",
                name: "Runbook 1",
                slug: "runbook_1",
                isPrivate: true,
                triggers: [
                  {
                    kind: "form",
                    triggerID: "trg1",
                  },
                ],
              },
              reviewers: [{ userID: "usr1" }],
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/users/get", (_, res, ctx) => {
          return res(
            ctx.json({
              user: {
                userID: "usr1",
                name: "George Du",
                avatarURL: "",
              },
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/entities/search", (_, res, ctx) => {
          throw new Error("Should not be called");
        }),
      );
    },
    runbookSlug: "runbook_1",
  },
  {
    testName: "no explicit permissions runbook",
    setupFunc: () => {
      server.use(
        rest.get("http://api/v0/runbooks/get", (_, res, ctx) => {
          return res(
            ctx.json({
              runbook: {
                runbookID: "rbk1",
                name: "Runbook 1",
                slug: "runbook_1",
                isPrivate: false,
                triggers: [
                  {
                    kind: "form",
                    triggerID: "trg1",
                  },
                ],
              },
              reviewers: [{ userID: "usr1" }],
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/users/get", (_, res, ctx) => {
          return res(
            ctx.json({
              user: {
                userID: "unused",
                name: "unused",
                avatarURL: "unused",
              },
            }),
          );
        }),
      );
      server.use(
        rest.get("http://api/v0/entities/search", (_, res, ctx) => {
          return res(
            ctx.json({
              results: [
                {
                  user: {
                    userID: "usr1",
                    name: "George Du",
                    avatarURL: "",
                  },
                },
              ],
            }),
          );
        }),
      );
    },
    runbookSlug: "runbook_1",
  },
];

describe("RequestRunnableDialog", () => {
  testCases.forEach(({ testName, setupFunc, taskSlug, runbookSlug }) => {
    it(testName, async () => {
      setupFunc();
      server.use(
        rest.post("http://api/v0/requests/create", (req, res, ctx) => {
          const b = req.body as {
            triggerID: string;
            reviewers: { userID?: string; groupID?: string }[];
          };
          expect(b.triggerID).toEqual("trg1");
          expect(b.reviewers).toEqual([{ userID: "usr1" }]);
          return res(ctx.json({ triggerRequestID: "trg1" }));
        }),
      );
      let onSubmitDone = false;
      const TestC = () => {
        const [opened, setOpened] = useState(true);
        return (
          <RequestRunnableDialog
            opened={opened}
            onSubmit={() => {
              setOpened(false);
              onSubmitDone = true;
            }}
            onClose={() => undefined}
            taskSlug={taskSlug}
            runbookSlug={runbookSlug}
            paramValues={{}}
          />
        );
      };
      render(<TestC />);
      const box = await screen.findByRole("searchbox");
      await userEvent.click(box);
      const row = await screen.findByText("George Du");
      await userEvent.click(row);
      const button = await screen.findByRole("button", { name: "Request" });
      await userEvent.click(button);

      await waitFor(() => {
        expect(onSubmitDone).toBe(true);
      });
    });
  });
});
