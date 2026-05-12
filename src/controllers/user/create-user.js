import { EmailAlreadyInUser } from "../../errors/user.js";
import {
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  emailAlreadyInUseResponse,
  invalidPasswordResponse,
  badRequest,
  created,
  serverError,
  validateRequireFields,
  requiredFieldIsMissingResponse,
} from "../helpers/index.js";
export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      const requireFields = ["first_name", "last_name", "email", "password"];

      const { ok: requireFieldWhereProvided, missingField } =
        validateRequireFields(params, requireFields);

      if (!requireFieldWhereProvided) {
        return requiredFieldIsMissingResponse(missingField);
      }

      const emailIsValid = checkIfEmailIsValid(params.email);

      if (!emailIsValid) {
        return emailAlreadyInUseResponse();
      }

      const passwordIsNotValid = checkIfPasswordIsValid(params.password);

      if (!passwordIsNotValid) {
        return invalidPasswordResponse();
      }

      const createdUser = await this.createUserUseCase.execute(params);

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
