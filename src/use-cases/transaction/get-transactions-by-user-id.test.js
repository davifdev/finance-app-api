import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id";

describe("GetTransactionsByUserIdUseCase", () => {
  const user_id = faker.string.uuid();

  const transactions = [
    {
      user_id,
      name: faker.lorem.words(6),
      date: faker.date.past().toISOString(),
      type: "EARNING",
      amount: faker.number.int(),
    },
    {
      user_id,
      name: faker.lorem.words(6),
      date: faker.date.past().toISOString(),
      type: "EARNING",
      amount: faker.number.int(),
    },
  ];

  const user = {
    first_name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

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
    const getUserByIdRepositorySpy = jest.spyOn(
      getUserByIdRepository,
      "execute",
    );

    await sut.execute(userId);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });
});
