import { badRequest, notFound } from "./http.js";

export const checkIfTypeIsValid = type =>
  ["EARNING", "EXPENSE", "INVESTMENT"].includes(type);

export const invalidAmountResponse = () => {
  return badRequest({
    message: "The amount must be a valid currency",
  });
};

export const transactionNotFoundResponse = () => {
  return notFound({
    message: "Transaction not found.",
  });
};

export const invalidTypeResponse = () => {
  return badRequest({
    message: "The type must be EARNING, EXPENSE or INVESTMENT",
  });
};
