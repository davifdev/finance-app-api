import { faker } from "@faker-js/faker";
import { DeleteUserController } from "./delete-user";
import { user } from "../../__tests__/index.js";
import { UserNotFoundError } from "../../errors/index.js";

describe("DeleteUserController", () => {
  class DeleteUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  const invalidHttpRequest = {
    params: {
      userId: "invalid-id",
    },
  };

  const makeSut = () => {
    const deleteUserUseCase = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCase);

    return { deleteUserUseCase, sut };
  };

  it("should return 200 if user is deleted", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should call DeleteUserUseCase with correct params", async () => {
    const { sut, deleteUserUseCase } = makeSut();

    const executeSpy = jest.spyOn(deleteUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(invalidHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, deleteUserUseCase } = makeSut();

    jest
      .spyOn(deleteUserUseCase, "execute")
      .mockRejectedValueOnce(new UserNotFoundError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should return 500 if occurs an error", async () => {
    const { sut, deleteUserUseCase } = makeSut();

    jest.spyOn(deleteUserUseCase, "execute").mockImplementation(() => {
      throw new Error("Server error");
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
