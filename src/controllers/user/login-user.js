import { ZodError } from "zod";
import { loginUserSchema } from "../../schemas/user.js";
import {
  badRequest,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "../helpers/index.js";
import { InvalidPasswordError, UserNotFoundError } from "../../errors/user.js";

export class LoginUserController {
  constructor(loginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      await loginUserSchema.parseAsync(params);

      const user = await this.loginUserUseCase.execute(
        params.email,
        params.password,
      );

      return ok(user);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0].message });
      }

      if (error instanceof InvalidPasswordError) {
        return unauthorized({ message: error.message });
      }

      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }

      return serverError();
    }
  }
}
