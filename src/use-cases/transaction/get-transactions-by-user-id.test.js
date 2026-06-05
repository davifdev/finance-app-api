import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id";
import { UserNotFoundError } from "../../errors/user.js";
import { transaction, user } from "../../__tests__/index.js";

describe("GetTransactionsByUserIdUseCase", () => {
  const user_id = faker.string.uuid();
  const from = "2024-01-01";
  const to = "2026-02-01";

  const transactions = [
    {
      ...transaction,
      user_id,
    },
  ];
  class GetTransactionsByUserIdRepositoryStub {
    async execute() {
      return transactions;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return { ...user, id: user_id };
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository =
      new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    );

    return { getTransactionByUserIdRepository, getUserByIdRepository, sut };
  };

  it("should returns transaction successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid());

    expect(result).toBeTruthy();
    expect(result).toStrictEqual(transactions);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const getUserByIdRepositorySpy = import.meta.jest.spyOn(
      getUserByIdRepository,
      "execute",
    );

    await sut.execute(userId);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetTransactionByUserIdRepository with correct params", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const getTransactionByUserIdRepositorySpy = import.meta.jest.spyOn(
      getTransactionByUserIdRepository,
      "execute",
    );

    await sut.execute(userId, from, to);

    expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(
      userId,
      from,
      to,
    );
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();

    import.meta.jest
      .spyOn(getUserByIdRepository, "execute")
      .mockResolvedValue(null);

    const promise = sut.execute(userId);

    expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    import.meta.jest
      .spyOn(getUserByIdRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid());

    expect(promise).rejects.toThrow();
  });

  it("should throw if GetTransactionsByUserIdRepository throws", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();

    import.meta.jest
      .spyOn(getTransactionByUserIdRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid());

    expect(promise).rejects.toThrow();
  });
});
