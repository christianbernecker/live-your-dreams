// PLACEHOLDER: Validation Schema
import { z } from "zod";

export const schema = z.object({
  id: z.string()
});

export type SchemaType = z.infer<typeof schema>;
