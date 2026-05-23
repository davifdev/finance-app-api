import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "./get-user-by-id";

describe("GetUserByIdUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: faker.internet.password(),
  };

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

    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
