import { UserNotFoundError } from "../../errors/user.js";
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from "../helpers.js";

export class GetUserBalanceController {
  constructor(getuserBalanceUseCase) {
    this.getuserBalanceUseCase = getuserBalanceUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId;

      const isValidId = checkIfIdIsValid(userId);

      if (isValidId) {
        return invalidIdResponse();
      }

      const balance = await this.getuserBalanceUseCase.execute({ userId });

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
