import { faker } from "@faker-js/faker";
import { GetUserBalanceUseCase } from "./get-user-balance";

describe("GetUserBalance", () => {
  const makeSut = () => {
    class GetUserBalanceRepositoryStub {
      async execute() {
        return {
          EARNINGS: "1000",
          EXPENSES: "1000",
          INVESTMENT: "1000",
          balance: "0",
        };
      }
    }

    class GetUserByIdRepositoryStub {
      async execute() {
        return {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          password: faker.internet.password(),
        };
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

  const balance = {
    EARNINGS: "1000",
    EXPENSES: "1000",
    INVESTMENT: "1000",
    balance: "0",
  };

  // const user = {
  //   id: faker.string.uuid(),
  //   email: faker.internet.email(),
  //   first_name: faker.person.firstName(),
  //   last_name: faker.person.lastName(),
  //   password: faker.internet.password(),
  // };

  it("should get user balance successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid);

    expect(result).toBeTruthy();
    expect(result).toStrictEqual(balance);
  });
});
