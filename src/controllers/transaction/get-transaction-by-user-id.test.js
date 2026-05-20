import { faker } from "@faker-js/faker";
import { GetTransactionByUserIdController } from "./get-transaction-by-user-id";
import { UserNotFoundError } from "../../errors/user";

describe("GetTransactionByUserIdController", () => {
  const makeSut = () => {
    class GetTransactionByUserIdUseCaseStub {
      async execute(transaction) {
        return transaction;
      }
    }

    const getTransactionByUserIdUseCase =
      new GetTransactionByUserIdUseCaseStub();
    const sut = new GetTransactionByUserIdController(
      getTransactionByUserIdUseCase,
    );

    return { getTransactionByUserIdUseCase, sut };
  };

  const httpRequest = {
    query: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 if transactions are retrieved", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 400 if user id is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      query: {
        userId: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if user id is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      query: {
        userId: "invalid-id",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if transaction are not found", async () => {
    const { getTransactionByUserIdUseCase, sut } = makeSut();

    jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockResolvedValue(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if occurs internal server error", async () => {
    const { getTransactionByUserIdUseCase, sut } = makeSut();

    jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockRejectedValue(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should return 404 if UserNotFoundError is thrown", async () => {
    const { getTransactionByUserIdUseCase, sut } = makeSut();

    jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockRejectedValue(new UserNotFoundError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });
});
