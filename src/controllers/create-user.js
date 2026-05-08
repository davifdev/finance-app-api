import { CreateUserUseCase } from "../use-cases/create-user.js";
import { EmailAlreadyInUser } from "../errors/user.js";
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailAlreadyInUseResponse,
  invalidPasswordResponse,
  badRequest,
  created,
  serverError,
} from "./helpers/index.js";

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

      const emailIsValid = checkIfEmailIsValid(params.email);

      if (!emailIsValid) {
        return emailAlreadyInUseResponse();
      }

      const passwordIsNotValid = checkIfPasswordIsValid(params.password);

      if (!passwordIsNotValid) {
        return invalidPasswordResponse();
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
