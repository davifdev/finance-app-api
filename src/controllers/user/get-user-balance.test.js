import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";
import { UserNotFoundError } from "../../errors/user";

describe("GetUserBalanceController", () => {
  const makeSut = () => {
    class GetUserBalanceUseCaseStub {
      async execute() {
        return {
          EARNINGS: "0",
          EXPENSES: "0",
          INVESTMENT: "0",
          balance: "0",
        };
      }
    }

    const getUserBalanceUseCaseStub = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCaseStub);

    return {
      getUserBalanceUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  const invalidHttpRequest = {
    params: {
      userId: "invalid-user-id",
    },
  };

  it("should return 200 and user balance", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toStrictEqual({
      EARNINGS: "0",
      EXPENSES: "0",
      INVESTMENT: "0",
      balance: "0",
    });
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if user is not found throws UserNotFoundError", async () => {
    const { sut, getUserBalanceUseCaseStub } = makeSut();

    jest.spyOn(getUserBalanceUseCaseStub, "execute").mockImplementation(() => {
      throw new UserNotFoundError(httpRequest.params.userId);
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});
