import validator from "validator";
import z from "zod";

export const createTransactionSchema = z.object({
  user_id: z.uuid("user id must be a valid id").min(1, "user_id is required"),
  name: z.string("name is required").trim().min(1, "name is required"),
  date: z
    .string("data is required")
    .datetime("date must be a valid ISO format"),
  type: z.enum(["EARNING", "EXPENSE", "INVESTMENT"], {
    error: () => ({
      message: "Type must be EXPENSE, EARNING or INVESTMENT",
    }),
  }),
  amount: z
    .number("amount must be a number")
    .min(1, "amount must be greater than 0")
    .refine(amount =>
      validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: ".",
      }),
    ),
});
