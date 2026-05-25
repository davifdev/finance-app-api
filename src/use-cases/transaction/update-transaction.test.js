import { faker } from "@faker-js/faker";
import { UpdateTransactionUseCase } from "./update-transaction";
import { transaction } from "../../__tests__/index.js";

describe("UpdateTransactionUseCase", () => {
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

  it("should call UpdateTransactionRepository with correct params", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const id = faker.string.uuid();

    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      "execute",
    );

    await sut.execute(id, transaction);

    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
      id,
      transaction,
    );
  });

  it("should throw if UpdateTransactionRepository throws", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const id = faker.string.uuid();

    jest
      .spyOn(updateTransactionRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(id, transaction);

    expect(promise).rejects.toThrow();
  });
});
