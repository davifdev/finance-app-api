import { faker } from "@faker-js/faker";
import { DeleteTransactionController } from "./delete-transaction";

describe("DeleteTransactionController", () => {
  const makeSut = () => {
    class DeleteTransactionControllerStub {
      async execute(transaction) {
        return transaction;
      }
    }

    const createTransactionUseCase = new DeleteTransactionControllerStub();
    const sut = new DeleteTransactionController(createTransactionUseCase);

    return { createTransactionUseCase, sut };
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
});
