import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { authenticators } from "./table";

export const zInsertAuthenticators = createInsertSchema(authenticators);

export const zSelectAuthenticators = createSelectSchema(authenticators);