import { faker } from "@faker-js/faker";
import { DeleteTransactionController } from "./delete-transaction";

describe("DeleteTransactionController", () => {
  const makeSut = () => {
    class DeleteTransactionControllerStub {
      async execute(transaction) {
        return transaction;
      }
    }

    const deleteTransactionUseCase = new DeleteTransactionControllerStub();
    const sut = new DeleteTransactionController(deleteTransactionUseCase);

    return { deleteTransactionUseCase, sut };
  };

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
  };

  it("should return 200 if transaction is deleted", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });

  it("should call DeleteTransactionUseCase with correct params", async () => {
    const { sut, deleteTransactionUseCase } = makeSut();

    const executeSpy = jest.spyOn(deleteTransactionUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.transactionId);
  });

  it("should return 400 if transaction id is invalid", async () => {
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
    const { deleteTransactionUseCase, sut } = makeSut();

    jest.spyOn(deleteTransactionUseCase, "execute").mockResolvedValue(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if occurs internal server error", async () => {
    const { deleteTransactionUseCase, sut } = makeSut();

    jest
      .spyOn(deleteTransactionUseCase, "execute")
      .mockRejectedValue(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
