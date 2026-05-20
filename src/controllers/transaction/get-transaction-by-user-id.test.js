import { faker } from "@faker-js/faker";
import { GetTransactionByUserIdController } from "./get-transaction-by-user-id";

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
});
