import { faker } from "@faker-js/faker";
import { CreateTransactionController } from "./create-transaction";

describe("CreateTransactionController", () => {
  const makeSut = () => {
    class CreateTransactionUseCaseStub {
      async execute() {
        return {
          user_id: faker.string.uuid(),
          name: faker.lorem.words(6),
          date: faker.date.past().toISOString(),
          type: "EARNING",
          amount: faker.number.int(),
        };
      }
    }

    const createTransactionUseCase = new CreateTransactionUseCaseStub();
    const sut = new CreateTransactionController(createTransactionUseCase);

    return { createTransactionUseCase, sut };
  };

  const httpRequest = {
    params: {
      user_id: faker.string.uuid(),
    },
    body: {
      user_id: faker.string.uuid(),
      name: faker.lorem.words(6),
      date: faker.date.past().toISOString(),
      type: "EARNING",
      amount: faker.number.int(),
    },
  };

  it("should return 201 when transaction is created", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
  });

  it("should return 400 if user_id is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        user_id: "invalid--uuid",
      },
    });

    expect(result.statusCode).toBe(400);
  });
});
