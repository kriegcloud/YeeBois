import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orgs } from "./table";

export const zInsertOrgs = createInsertSchema(orgs);

export const zSelectOrgs = createSelectSchema(orgs);