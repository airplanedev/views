import { ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { RequestRunnableDialog } from "./RequestRunnableDialog";

export default {
  title: "RequestRunnableDialog",
  component: RequestRunnableDialog,
} as ComponentMeta<typeof RequestRunnableDialog>;

export const Simple = () => {
  const [opened, setOpened] = useState(true);
  return (
    <RequestRunnableDialog
      opened={opened}
      onSubmit={() => setOpened(false)}
      onClose={() => setOpened(false)}
      taskSlug="exit_1"
      paramValues={{}}
    />
  );
};
Simple.parameters = {
  mockData: [
    {
      url: "http://api/v0/tasks/getTaskReviewers?taskSlug=exit_1",
      method: "GET",
      status: 200,
      response: {
        task: {
          taskID: "tsk20210715z1dxw02",
          name: "Exit 1",
          slug: "exit_1",
          requireExplicitPermissions: false,
          triggers: [
            {
              kind: "form",
              triggerID: "trg20210728z3095m5",
            },
          ],
        },
        reviewers: [],
      },
    },
    {
      url: "http://api/v0/entities/search?q=&scope=all",
      method: "GET",
      status: 200,
      response: {
        results: [
          {
            user: null,
            group: {
              id: "1q0LViSn4DA0bahEdYZqIIypnnB",
              name: "Admins",
            },
          },
          {
            user: {
              userID: "usr20220418zesvznlxh9i",
              name: "Ameya Khare",
            },
            group: null,
          },
          {
            user: {
              userID: "prof_01EWE7360JQCXWTPTRQV9R569X",
              name: "Benjamin Yolken",
              avatarURL:
                "https://lh3.googleusercontent.com/a-/AOh14GgJKddngvPf3UTcsYMWOpgzscSli9YWEqJssOnX=s96-c",
            },
            group: null,
          },
          {
            user: {
              userID: "prof_01EWE7360JQCXWTPTRQV9R569N",
              name: "Colin King",
              avatarURL:
                "https://lh3.googleusercontent.com/a-/AOh14Gglo5JTMHELUSzEg8puAP_98YqAtfJhhWnoHvOm=s96-c",
            },
            group: null,
          },
          {
            user: {
              userID: "usr20220429zeofnm8hkmw",
              name: "George Du",
              avatarURL:
                "https://lh3.googleusercontent.com/a-/AFdZucoyKtpOD1IhdGLIzr-H8aTyIRPLYvUm7-Y4aZBY=s96-c",
            },
            group: null,
          },
        ],
      },
    },
    {
      url: "http://api/v0/requests/create",
      method: "POST",
      status: 200,
      response: { triggerRequestID: "trq20220830z4hycm98kq0" },
    },
  ],
};
