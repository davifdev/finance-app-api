import { ZodError } from "zod";
import { EmailAlreadyInUser } from "../../errors/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  badRequest,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js";
import { updateUserSchema } from "../../schemas/user.js";

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const isIdValid = checkIfIdIsValid(userId);

      const params = httpRequest.body;

      if (!isIdValid) {
        return invalidIdResponse();
      }

      await updateUserSchema.parseAsync(params);

      const updateUser = await this.updateUserUseCase.execute(userId, params);

      if (!updateUser) {
        return userNotFoundResponse();
      }

      return ok(updateUser);
    } catch (error) {
      // if (error.issues[0].code === "unrecognized_keys") {
      //   error.issues[0].message = "some provided field is not allowed";
      // }
      if (error instanceof ZodError) {
        return badRequest({
          message: error.issues[0].message,
        });
      }
      if (error instanceof EmailAlreadyInUser) {
        return badRequest({ message: error.message });
      }
      return serverError();
    }
  }
}
