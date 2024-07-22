import { z } from "zod";
export const boardSchema = z.object({
  name: z.string().min(2).max(55),
  status: z
    .array(
      z
        .string()
        .min(2, { message: "Each status must be at least 2 characters long" })
        .max(55, { message: "Each status can be at most 55 characters long" })
        .regex(/^[a-zA-Z]+$/, { message: "Status must contain only letters" })
    )
    .refine((val) => val.length > 0, { message: "Add at least one status" }),
});
