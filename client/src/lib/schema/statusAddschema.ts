import { z } from "zod";

export const statusAddSchema = z.object({
  status: z
    .string()
    .min(2, { message: "Status must be at least 2 characters long." })
    .max(30, { message: "Status must be at most 30 characters long." })
    .refine(
      (val) => {
        const trimmed = val.trim();
        const hasLetter = /[a-zA-Z]/.test(trimmed);
        const hasNumber = /\d/.test(trimmed);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed);
        const hasOnlyNumbers = /^[0-9]+$/.test(trimmed);
        const hasOnlySpecialChars = /^[!@#$%^&*(),.?":{}|<>]+$/.test(trimmed);

        // Ensure it doesn't contain only numbers or only special characters
        if (hasOnlyNumbers || hasOnlySpecialChars) {
          return false;
        }

        // Ensure it has letters, numbers, or special characters
        return hasLetter || hasNumber || hasSpecialChar;
      },
      {
        message:
          "Status cannot contain only numbers or special characters, and must contain at least one letter.",
      }
    )
    .refine((val) => val.trim() === val, {
      message: "Status cannot start or end with spaces.",
    }),
});
