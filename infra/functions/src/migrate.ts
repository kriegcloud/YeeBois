import { ApiHandler } from "sst/node/api";
import { migrate } from "../../../packages/service-modules/drizzle/src/migrate";

export const handler = ApiHandler(async (_event) => {
  await migrate("migrations");
  return {
    body: "Migrations completed",
  };
});
