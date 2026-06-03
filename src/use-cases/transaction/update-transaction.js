import { TransactionForbiden } from "../../errors/user.js";
export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getTransactionByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository;
    this.getTransactionByIdRepository = getTransactionByIdRepository;
  }

  async execute(transactionId, params) {
    const transactionIsValid =
      await this.getTransactionByIdRepository.execute(transactionId);

    if (params?.user_id && params.user_id !== transactionIsValid.user_id) {
      throw new TransactionForbiden("Forbiden");
    }

    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      params,
    );

    return transaction;
  }
}
