import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
} from "../../controllers";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
} from "./user";

describe("UserControllerFactories", () => {
  it("should return a valid GetUserByIdController instance", () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });

  it("should return a valid CreateUserController instance", () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
  });

  it("should return a valid DeleteUserController instance", () => {
    expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController);
  });

  it("should return a valid GetUserBalanceController instance", () => {
    expect(makeGetUserBalanceController()).toBeInstanceOf(
      GetUserBalanceController,
    );
  });
});
