import { UserNotFoundError } from "../../errors/user.js";

export class GetUserBalanceUseCase {
  constructor(getUserBalanceRepository, getUserByIdRepository) {
    this.getUserBalanceRepository = getUserBalanceRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(params) {
    const userId = params.userId;

    const user = this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const balance = await this.getUserBalanceRepository.execute(userId);

    return balance;
  }
}
