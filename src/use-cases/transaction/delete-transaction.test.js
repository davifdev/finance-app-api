import { faker } from "@faker-js/faker";
import { DeleteTransactionUseCase } from "./delete-transaction,";
import { transaction } from "../../__tests__/index.js";

describe("DeleteTransactionUseCase", () => {
  const user_id = faker.string.uuid();
  class DeleteTransactionRepositoryStub {
    async execute() {
      return { ...transaction, user_id };
    }
  }

  class GetTransactionByIdRepositoryStub {
    async execute() {
      return { ...transaction, user_id };
    }
  }

  const makeSut = () => {
    const getTransactionByIdRepository = new GetTransactionByIdRepositoryStub();
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionUseCase(
      deleteTransactionRepository,
      getTransactionByIdRepository,
    );

    return {
      deleteTransactionRepository,
      getTransactionByIdRepository,
      sut,
    };
  };

  it("should deleted transaction successfully", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(transaction.id, user_id);

    expect(result).toBeTruthy();
    expect(result).toStrictEqual({ ...transaction, user_id });
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    const { sut, deleteTransactionRepository } = makeSut();

    const deleteTransactionSpy = import.meta.jest.spyOn(
      deleteTransactionRepository,
      "execute",
    );

    await sut.execute(transaction.id, user_id);

    expect(deleteTransactionSpy).toHaveBeenCalledWith(transaction.id);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    const { sut, deleteTransactionRepository } = makeSut();

    import.meta.jest
      .spyOn(deleteTransactionRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(transaction.id, user_id);

    expect(promise).rejects.toThrow();
  });
});
