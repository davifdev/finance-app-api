import { faker } from "@faker-js/faker";
import { CreateTransactionUseCase } from "./create-transaction";
import { UserNotFoundError } from "../../errors/user";

describe("CreateTransactionUseCase", () => {
  const user = {
    first_name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const transaction = {
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int(),
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

    const result = await sut.execute(transaction);

    expect(result).toStrictEqual({ ...transaction, id: "random_id" });
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(transaction);

    expect(executeSpy).toHaveBeenCalledWith(transaction.user_id);
  });

  it("should call IdGeneratorAdapter", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, "execute");

    await sut.execute(transaction);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionRepositoryStub = jest.spyOn(
      createTransactionRepository,
      "execute",
    );

    await sut.execute(transaction);

    expect(createTransactionRepositoryStub).toHaveBeenCalledWith({
      ...transaction,
      id: "random_id",
    });
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null);

    const promise = sut.execute(transaction);

    expect(promise).rejects.toThrow(new UserNotFoundError(transaction.user_id));
  });
});
