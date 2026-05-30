import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "./get-user-by-id";
import { user } from "../../__tests__/index.js";

describe("GetUserByIdUseCase", () => {
  const makeSut = () => {
    class GetUserByIdRepositoryStub {
      async execute() {
        return user;
      }
    }

    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { getUserByIdRepository, sut };
  };

  it("should getUserById successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid());

    expect(result).toBeTruthy();
    expect(result).toStrictEqual(user);
  });

  it("should calls GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();

    const executeSpy = import.meta.jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();

    import.meta.jest
      .spyOn(getUserByIdRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid());

    expect(promise).rejects.toThrow();
  });
});
