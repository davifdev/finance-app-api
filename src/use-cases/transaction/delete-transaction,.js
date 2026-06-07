import { TransactionNotFoundError } from "../../errors/index.js";
import { TransactionForbiden } from "../../errors/index.js";

export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository, getTransactionByIdRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }

  async execute(transactionId, userId) {
    const transaction =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (!transaction) {
      throw new TransactionNotFoundError(transactionId);
    }

    if (userId && transaction.user_id !== userId) {
      throw new TransactionForbiden();
    }

    const deletedTransaction =
      await this.deleteTransactionRepository.execute(transactionId);

    return deletedTransaction;
  }
}
