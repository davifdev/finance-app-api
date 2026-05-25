import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "./get-user-balance";
import { UserNotFoundError } from "../../errors/user";
import { balance, user } from "../../__tests__/index.js";

describe("GetUserBalance", () => {
  const makeSut = () => {
    class GetUserBalanceRepositoryStub {
      async execute() {
        return balance;
      }
    }

    class GetUserByIdRepositoryStub {
      async execute() {
        return user;
      }
    }

    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    );

    return { sut, getUserBalanceRepository, getUserByIdRepository };
  };

  it("should get user balance successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid);

    expect(result).toBeTruthy();
    expect(result).toStrictEqual(balance);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository receives invalid userId", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid;
    jest.spyOn(getUserByIdRepository, "execute").mockReturnValue(null);

    const promise = sut.execute(userId);

    expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();

    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserBalanceRepository with correct params", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = faker.string.uuid();

    const executeSpy = jest.spyOn(getUserBalanceRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    jest.spyOn(getUserByIdRepository, "execute").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow();
  });

  it("should throw if GetUserBalance throws", async () => {
    const { sut, getUserBalanceRepository } = makeSut();

    jest.spyOn(getUserBalanceRepository, "execute").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow();
  });
});
