import { UserNotFoundError } from "../../errors/user.js";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js";

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;
      const isValidId = checkIfIdIsValid(userId);

      if (!isValidId) {
        return invalidIdResponse();
      }

      const balance = await this.getUserBalanceUseCase.execute(userId);

      if (!balance) {
        return userNotFoundResponse();
      }

      return ok(balance);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}
