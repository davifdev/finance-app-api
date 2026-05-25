import { CreateTransactionUseCase } from "./create-transaction";
import { UserNotFoundError } from "../../errors/user";
import { user } from "../../__tests__/index.js";
import { transaction } from "../../__tests__/index.js";

describe("CreateTransactionUseCase", () => {
  const createTransactionParams = {
    ...transaction,
    id: undefined,
  };
  class CreateTransactionRepositoryStub {
    async execute(transaction) {
      return transaction;
    }
  }
  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId };
    }
  }
  class IdGeneratorAdapterStub {
    execute() {
      return "random_id";
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
      sut,
    };
  };

  it("should create transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(createTransactionParams);

    expect(result).toStrictEqual({ ...transaction, id: "random_id" });
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(createTransactionParams);

    expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id);
  });

  it("should call IdGeneratorAdapter", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, "execute");

    await sut.execute(createTransactionParams);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionRepositoryStub = jest.spyOn(
      createTransactionRepository,
      "execute",
    );

    await sut.execute(createTransactionParams);

    expect(createTransactionRepositoryStub).toHaveBeenCalledWith({
      ...transaction,
      id: "random_id",
    });
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null);

    const promise = sut.execute(createTransactionParams);

    expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    );
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    jest.spyOn(getUserByIdRepository, "execute").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.execute(createTransactionParams);

    expect(promise).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    const { sut, idGeneratorAdapter } = makeSut();

    jest.spyOn(idGeneratorAdapter, "execute").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.execute(createTransactionParams);

    expect(promise).rejects.toThrow();
  });

  it("should throw if CreateTransactionRepository throws", async () => {
    const { sut, createTransactionRepository } = makeSut();

    jest
      .spyOn(createTransactionRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(createTransactionParams);

    expect(promise).rejects.toThrow();
  });
});
