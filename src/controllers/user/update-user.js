import { ZodError } from "zod";
import { EmailAlreadyInUser } from "../../errors/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  badRequest,
  ok,
  serverError,
} from "../helpers/index.js";
import { updateUserSchema } from "../../schemas/user.js";

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const userId = httpRequest.params.userId;
      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      await updateUserSchema.parseAsync(params);

      const updateUser = await this.updateUserUseCase.execute(userId, params);

      return ok(updateUser);
    } catch (error) {
      console.error(error);
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
