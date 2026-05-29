import { badRequest, notFound } from "./http.js";

export const invalidPasswordResponse = () => {
  return badRequest({
    message: "Password must be at least 6 characters.",
  });
};

export const emailAlreadyInUseResponse = () => {
  return badRequest({
    message: "Emais is invalid. Please provide a valid one.",
  });
};

export const userNotFoundResponse = () => {
  return notFound({
    message: "User not found.",
  });
};
