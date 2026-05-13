import { UserNotFoundError } from "../../errors/user.js";
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
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

      const balance = await this.getUserBalanceUseCase.execute({ userId });

      return ok(balance);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError();
    }
  }
}
