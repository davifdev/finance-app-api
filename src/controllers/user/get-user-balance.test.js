import { faker } from "@faker-js/faker";
import { GetUserBalanceController } from "./get-user-balance.js";
import { UserNotFoundError } from "../../errors/user.js";
import { balance } from "../../__tests__/index.js";

describe("GetUserBalanceController", () => {
  const makeSut = () => {
    class GetUserBalanceUseCaseStub {
      async execute() {
        return balance;
      }
    }

    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
    const sut = new GetUserBalanceController(getUserBalanceUseCase);

    return {
      getUserBalanceUseCase,
      sut,
    };
  };

  const from = "2024-01-01";
  const to = "2026-02-01";

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    query: {
      from,
      to,
    },
  };

  const invalidHttpRequest = {
    params: {
      userId: "invalid-user-id",
    },
    query: {
      from,
      to,
    },
  };

  it("should return 200 when getting user balance", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should call GetUserBalanceUseCase with correct params", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    const executeSpy = import.meta.jest.spyOn(getUserBalanceUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.query.from,
      httpRequest.query.to,
    );
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if user is not found throws UserNotFoundError", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    import.meta.jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockImplementation(() => {
        throw new UserNotFoundError(httpRequest.params.userId);
      });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if GetUserBalanceUseCase throwns an error", async () => {
    const { sut, getUserBalanceUseCase } = makeSut();

    import.meta.jest
      .spyOn(getUserBalanceUseCase, "execute")
      .mockImplementation(() => {
        throw new Error("Server error");
      });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
