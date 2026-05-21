import { UserNotFoundError } from "../../errors/user.js";
export class CreateTransactionUseCase {
  constructor(
    createTransactionRepository,
    getUserByIdRepository,
    IdGeneratorAdapter,
  ) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.IdGeneratorAdapter = IdGeneratorAdapter;
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.user_id;

    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = this.IdGeneratorAdapter.execute();

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    });

    return transaction;
  }
}
