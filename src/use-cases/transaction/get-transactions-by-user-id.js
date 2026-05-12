import { userNotFoundResponse } from "../../controllers/helpers/user.js";

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params) {
    const userId = params.user_id;

    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      return userNotFoundResponse();
    }

    const transactions = await this.getTransactionsByUserIdRepository(userId);

    return transactions;
  }
}
