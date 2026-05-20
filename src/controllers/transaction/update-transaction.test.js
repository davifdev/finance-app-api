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

  it("should return 400 if some provided field is not allowed", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        someField: "some value",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if amount is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        amount: "invalid-amount",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if id is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        transactionId: "invalid-id",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if transaction is not found", async () => {
    const { sut, updateTransactionUseCase } = makeSut();

    jest.spyOn(updateTransactionUseCase, "execute").mockResolvedValue(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });
});
