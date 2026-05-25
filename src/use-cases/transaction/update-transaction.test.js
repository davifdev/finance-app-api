import { faker } from "@faker-js/faker";
import { UpdateTransactionUseCase } from "./update-transaction";

describe("UpdateTransactionUseCase", () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int(),
  };

  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        ...transaction,
      };
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionUseCase(updateTransactionRepository);

    return { sut, updateTransactionRepository };
  };

  it("should updated transaction successfully", async () => {
    const { sut } = makeSut();
    const id = faker.string.uuid();

    const result = await sut.execute(id, {
      name: faker.lorem.words(8),
    });

    expect(result).toBeTruthy();
    expect(result).toStrictEqual({ id, ...transaction });
  });
});
