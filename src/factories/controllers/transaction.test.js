import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from "../../controllers";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from "./transaction";

describe("TransactionControllerFactories", () => {
  it("should return a valid CreateTransactionController instance", () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    );
  });

  it("should return a valid GetTransactionByUserIdController", () => {
    expect(makeGetTransactionByUserIdController()).toBeInstanceOf(
      GetTransactionByUserIdController,
    );
  });

  it("should return a valid UpdateTransactionController", () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    );
  });

  it("should return a valid DeleteTransactionController", () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    );
  });
});
