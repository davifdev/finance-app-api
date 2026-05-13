import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  transactionNotFoundResponse,
} from "../helpers/index.js";

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const idIsValid = checkIfIdIsValid(transactionId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const transaction =
        await this.deleteTransactionUseCase.execute(transactionId);

      if (!transaction) {
        return transactionNotFoundResponse();
      }

      return ok(transaction);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
