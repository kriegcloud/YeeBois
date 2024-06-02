import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { accountCredentials } from "./table";

export const zInsertAccountCredentials = createInsertSchema(accountCredentials);

export const zSelectAccountCredentials = createSelectSchema(accountCredentials);