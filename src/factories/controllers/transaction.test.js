import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByUserIdController,
} from "../../controllers";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
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

  it("should return a valid DeleteTransactionController", () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    );
  });
});
