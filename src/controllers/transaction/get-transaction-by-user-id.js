import { ZodError } from "zod";
import { UserNotFoundError } from "../../errors/user.js";
import { getTransactionByUserIdSchema } from "../../schemas/transactions.js";
import {
  badRequest,
  ok,
  serverError,
  transactionNotFoundResponse,
  userNotFoundResponse,
} from "../helpers/index.js";

export class GetTransactionByUserIdController {
  constructor(getTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase;
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId;
      const from = httpRequest.query.from;
      const to = httpRequest.query.to;

      await getTransactionByUserIdSchema.parseAsync({
        user_id: userId,
        from,
        to,
      });

      const transactions = await this.getTransactionByUserIdUseCase.execute(
        userId,
        from,
        to,
      );

      if (!transactions) {
        return transactionNotFoundResponse();
      }

      return ok(transactions);
    } catch (error) {
      console.error(error);
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      if (error instanceof ZodError) {
        return badRequest({
          message: error.issues[0].message,
        });
      }
      return serverError();
    }
  }
}
