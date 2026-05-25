import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "./delete-transaction,";

describe("DeleteTransactionUseCase", () => {
  const transaction = {
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int(),
  };

  class DeleteTransactionRepositoryStub {
    async execute() {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

    return {
      deleteTransactionRepository,
      sut,
    };
  };

  it("should deleted transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid());

    expect(result).toBeTruthy();
    expect(result).toStrictEqual(transaction);
  });

  it("should call with correct params", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();

    const deleteTransactionSpy = jest.spyOn(
      deleteTransactionRepository,
      "execute",
    );

    await sut.execute(transactionId);

    expect(deleteTransactionSpy).toHaveBeenCalledWith(transactionId);
  });
});
