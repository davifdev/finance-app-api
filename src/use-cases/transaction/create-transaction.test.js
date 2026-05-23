import { faker } from "@faker-js/faker";
import { CreateTransactionUseCase } from "./create-transaction";

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
});
