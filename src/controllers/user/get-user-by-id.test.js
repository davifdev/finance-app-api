import { faker } from "@faker-js/faker";
import { GetUserByIdController } from "./get-user-by-id.js";
import { user } from "../../__tests__/index.js";

describe("GetUserByIdController", () => {
  const makeSut = () => {
    class GetUserByIdUseCaseStub {
      async execute() {
        return user;
      }
    }

    const getUserByIdUseCase = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return {
      getUserByIdUseCase,
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

  it("should return 200 when getting user by id", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should call GetUserByIdUseCase with correct params", async () => {
    const { sut, getUserByIdUseCase } = makeSut();

    const executeSpy = jest.spyOn(getUserByIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, getUserByIdUseCase } = makeSut();

    jest.spyOn(getUserByIdUseCase, "execute").mockResolvedValue(null);

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if getUserByIdUseCase throws", async () => {
    const { sut, getUserByIdUseCase } = makeSut();

    jest.spyOn(getUserByIdUseCase, "execute").mockRejectedValue(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
