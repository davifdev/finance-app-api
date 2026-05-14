import z from "zod";

export const createUserSchema = z.object({
  first_name: z
    .string("first_name is required")
    .trim()
    .min(1, "first_name is required"),
  last_name: z
    .string("last_name is required")
    .trim()
    .min(1, "last_name is required"),
  email: z
    .email("please provide a valid email")
    .trim()
    .min(1, "e-mail is required"),
  password: z
    .string("password is required")
    .trim()
    .min(6, "password must have at least 6 characters"),
});
