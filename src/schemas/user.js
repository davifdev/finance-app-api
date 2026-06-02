import z from "zod";

export const createUserSchema = z.object({
  first_name: z
    .string("please provide a valid first_name")
    .trim()
    .min(1, "first_name is required"),
  last_name: z
    .string("please provide a valid last_name")
    .trim()
    .min(1, "last_name is required"),
  email: z
    .email("please provide a valid email")
    .trim()
    .min(1, "e-mail is required"),
  password: z
    .string("please provide a valid password")
    .trim()
    .min(6, "password must have at least 6 characters"),
});

export const updateUserSchema = createUserSchema.partial().strict({
  message: "some provided field is not allowed",
});

export const loginUserSchema = z.object({
  email: z
    .email("please provide a valid email")
    .trim()
    .min(1, "e-mail is required"),
  password: z
    .string("password is required")
    .trim()
    .min(6, "password must have at least 6 characters"),
});
