import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "./delete-transaction,";
import { transaction } from "../../__tests__/index.js";

describe("DeleteTransactionUseCase", () => {
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...transaction, id: transactionId };
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
    const transactionId = faker.string.uuid();
    const result = await sut.execute(transactionId);

    expect(result).toBeTruthy();
    expect(result).toStrictEqual({
      ...transaction,
      id: transactionId,
    });
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();

    const deleteTransactionSpy = import.meta.jest.spyOn(
      deleteTransactionRepository,
      "execute",
    );

    await sut.execute(transactionId);

    expect(deleteTransactionSpy).toHaveBeenCalledWith(transactionId);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    const { sut, deleteTransactionRepository } = makeSut();

    import.meta.jest
      .spyOn(deleteTransactionRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid());

    expect(promise).rejects.toThrow();
  });
});
