import { rest } from "msw";

import { server } from "client/test-utils/mock";

export const setupTaskPermissions = (opts?: {
  execute?: boolean;
  request?: boolean;
}) => {
  server.use(
    rest.get("http://api/v0/permissions/get", (_, res, ctx) => {
      return res(
        ctx.json({
          resource: {
            "tasks.execute": opts?.execute ?? true,
            "tasks.request_run": opts?.request ?? true,
          },
        }),
      );
    }),
  );
};

export const setupTaskAndRunbookPermissions = (opts?: {
  execute?: boolean;
  request?: boolean;
}) => {
  server.use(
    rest.get("http://api/v0/permissions/get", (_, res, ctx) => {
      return res(
        ctx.json({
          resource: {
            "tasks.execute": opts?.execute ?? true,
            "tasks.request_run": opts?.request ?? true,
            "runbooks.execute": opts?.execute ?? true,
            "trigger_requests.create": opts?.request ?? true,
          },
        }),
      );
    }),
  );
};

export const setupTaskPermissionsFail = (onCall: () => void) => {
  server.use(
    rest.get("http://api/v0/permissions/get", (_, res, ctx) => {
      onCall();
      return res(ctx.status(401));
    }),
  );
};
