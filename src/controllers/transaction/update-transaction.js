import { ZodError } from "zod";
import { updateTransactionSchema } from "../../schemas/transactions.js";
import {
  invalidIdResponse,
  checkIfIdIsValid,
  ok,
  serverError,
  badRequest,
  transactionNotFoundResponse,
} from "../helpers/index.js";
import { TransactionNotFoundError } from "../../errors/transaction.js";

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId;
      const idIsVallid = checkIfIdIsValid(transactionId);

      if (!idIsVallid) {
        return invalidIdResponse();
      }

      const params = httpRequest.body;

      await updateTransactionSchema.parseAsync(params);

      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params,
      );

      // if (!transaction) {
      //   return transactionNotFoundResponse();
      // }

      return ok(transaction);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest({
          message: error.issues[0].message,
        });
      }

      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse();
      }
      return serverError();
    }
  }
}
