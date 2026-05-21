import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";
import { UserNotFoundError } from "../../errors/user.js";

describe("GetUserBalanceController", () => {
  const makeSut = () => {
    class GetUserBalanceUseCaseStub {
      async execute() {
        return {
          EARNINGS: "1000",
          EXPENSES: "1000",
          INVESTMENT: "1000",
          balance: "0",
        };
      }
    }

    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return {
      getUserBalanceUseCase,
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

  it("should return 200 when getting user balance", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toStrictEqual({
      EARNINGS: "1000",
      EXPENSES: "1000",
      INVESTMENT: "1000",
      balance: "0",
    });
  });

  it("should call GetUserBalanceUseCase with correct params", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    const executeSpy = jest.spyOn(getUserBalanceUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if user is not found throws UserNotFoundError", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    jest.spyOn(getUserBalanceUseCase, "execute").mockImplementation(() => {
      throw new UserNotFoundError(httpRequest.params.userId);
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if GetUserBalanceUseCase throwns an error", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    jest.spyOn(getUserBalanceUseCase, "execute").mockImplementation(() => {
      throw new Error("Server error");
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
