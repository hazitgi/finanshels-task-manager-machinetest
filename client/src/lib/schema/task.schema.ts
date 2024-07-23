

import { z } from "zod";

export const taskSchema = z.object({
    title: z
        .string()
        .min(2, { message: "Title must be at least 2 characters long" })
        .max(50, { message: "Title must be no more than 10 characters long" }),
    // order: z
    //     .string()
    //     .refine((val) => /^\d+$/.test(val), { message: "Order must be a non-negative number" }),
    description: z
        .string()
        .min(5, { message: "Description must be at least 5 characters long" }),
});