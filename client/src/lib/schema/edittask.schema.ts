import { z } from "zod";

export const editTaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(10, { message: "Title must be no more than 10 characters long" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long" }),
});