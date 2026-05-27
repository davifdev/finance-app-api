import { CreateUserController, GetUserByIdController } from "../../controllers";
import { makeCreateUserController, makeGetUserByIdController } from "./user";

describe("UserControllerFactories", () => {
  it("should return a valid GetUserByIdController instance", () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });

  it("should return a valid CreateUserController instance", () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController);
  });
});
