import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from "validator";
import { badRequest, created, serverError } from "./helpers.js";
import { EmailAlreadyInUser } from "../errors/user.js";

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      const requireFields = ["first_name", "last_name", "email", "password"];

      for (const field of requireFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({
            message: `Missing param ${field}`,
          });
        }
      }

      const emailIsValid = validator.isEmail(params.email);

      if (!emailIsValid) {
        return badRequest({
          message: "Email is Invalid. Please provider a valid one.",
        });
      }

      const passwordIsValid = params.password.length < 6;

      if (passwordIsValid) {
        return badRequest({
          message: "Password must be at least 6 characters",
        });
      }

      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      return created(createdUser);
    } catch (error) {
      if (error instanceof EmailAlreadyInUser) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}
