import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
} from "../../controllers";
import {
  makeCreateUserController,
  makeDeleteUserController,
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
});
