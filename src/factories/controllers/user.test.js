import { GetUserByIdController } from "../../controllers";
import { makeGetUserByIdController } from "./user";

describe("UserControllerFactories", () => {
  it("should return a valid GetUserByIdController instance", () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController);
  });
});
