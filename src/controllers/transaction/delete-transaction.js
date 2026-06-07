import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  transactionNotFoundResponse,
} from "../helpers/index.js";
import { TransactionNotFoundError } from "../../errors/index.js";
export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const userId = httpRequest.params.user_id;
      const idIsValid = checkIfIdIsValid(transactionId);

      if (!idIsValid || !userId) {
        return invalidIdResponse();
      }

      const transaction = await this.deleteTransactionUseCase.execute(
        transactionId,
        userId,
      );

      if (!transaction) {
        return transactionNotFoundResponse();
      }

      return ok(transaction);
    } catch (error) {
      console.log(error);
      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse();
      }

      return serverError();
    }
  }
}
