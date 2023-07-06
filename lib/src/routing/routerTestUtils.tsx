import { rest } from "msw";

import { server } from "client/test-utils/mock";

export const getRoutingCalls = () => {
  server.use(
    rest.get("http://api/v0/views/get", (req, res, ctx) => {
      return res(ctx.json({ slug: "slug", id: "id" }));
    }),
    rest.get("http://api/v0/hosts/web", (req, res, ctx) => {
      return res(ctx.json("https://app.airplane.dev"));
    }),
    rest.get("http://api/v0/tasks/getMetadata", (req, res, ctx) => {
      return res(ctx.json({ slug: "slug", id: "id" }));
    }),
  );
};
