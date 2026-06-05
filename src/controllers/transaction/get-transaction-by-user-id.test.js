import { faker } from "@faker-js/faker";
import { GetTransactionByUserIdController } from "./get-transaction-by-user-id";
import { UserNotFoundError } from "../../errors/user";

describe("GetTransactionByUserIdController", () => {
  const from = "2024-01-01";
  const to = "2026-02-01";

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
      from,
      to,
    },
  };

  it("should return 200 if transactions are retrieved", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should call GetTransactionByUserIdUseCase with correct params", async () => {
    const { sut, getTransactionByUserIdUseCase } = makeSut();

    const executeSpy = import.meta.jest.spyOn(
      getTransactionByUserIdUseCase,
      "execute",
    );

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.query.userId,
      httpRequest.query.from,
      httpRequest.query.to,
    );
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

    import.meta.jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockResolvedValue(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if occurs internal server error", async () => {
    const { getTransactionByUserIdUseCase, sut } = makeSut();

    import.meta.jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockRejectedValue(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should return 404 if UserNotFoundError is thrown", async () => {
    const { getTransactionByUserIdUseCase, sut } = makeSut();

    import.meta.jest
      .spyOn(getTransactionByUserIdUseCase, "execute")
      .mockRejectedValue(new UserNotFoundError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });
});
