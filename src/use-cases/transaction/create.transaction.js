import { UserNotFoundError } from "../../errors/user";
import { v4 as uuidv4 } from "uuid";

export class CreateTransactionUseCase {
  constructor(createTransactionRepository, getUserByIdRepository) {
    this.createTransactionRepository = createTransactionRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.userId;

    const user = await this.getUserByIdRepository(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const transactionId = uuidv4();

    const transaction = await this.createTransactionRepository({
      ...createTransactionParams,
      id: transactionId,
    });

    return transaction;
  }
}
