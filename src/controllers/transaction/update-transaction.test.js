import { faker } from "@faker-js/faker";
import { UpdateTransactionController } from "./update-transaction";

describe("UpdateTransactionController", () => {
  const makeSut = () => {
    class UpdateTransactionUseCaseStub {
      async execute(transaction) {
        return transaction;
      }
    }

    const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
    const sut = new UpdateTransactionController(updateTransactionUseCase);

    return { updateTransactionUseCase, sut };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.lorem.words(),
      date: faker.date.recent(),
      amount: faker.number.int(),
      type: "EXPENSE",
    },
  };

  it("should return 200 if transaction is updated", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 200 if type to EXPENSE is updated", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: "EXPENSE",
      },
    });

    expect(result.statusCode).toBe(200);
  });

  it("should return 200 if type to EARNING is updated", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: "EARNING",
      },
    });

    expect(result.statusCode).toBe(200);
  });

  it("should return 200 if type to INVESTMENT is updated", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: "INVESTMENT",
      },
    });

    expect(result.statusCode).toBe(200);
  });
});
