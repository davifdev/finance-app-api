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

  it("should return 400 if name is empty", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        name: "",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if date is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        date: "invalid-date",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if type is different from EARNING, EXPENSE or INVESTMENT", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        type: "INVALID_TYPE",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if amount is incorrect format", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        amount: "invalid_amount",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if ocurs an internal server error", async () => {
    const { sut, createTransactionUseCase } = makeSut();

    jest.spyOn(createTransactionUseCase, "execute").mockImplementation(() => {
      throw new Error();
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
