import { faker } from "@faker-js/faker";
import { DeleteUserUseCase } from "./delete-user";

describe("DeleteUserUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: faker.internet.password(),
  };

  const makeSut = () => {
    class DeleteUserRepositoryStub {
      async execute() {
        return user;
      }
    }

    const deleteUserRepository = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return { deleteUserRepository, sut };
  };

  it("should successfully delete a user", async () => {
    const { sut } = makeSut();

    const deletedUser = await sut.execute(faker.string.uuid());

    expect(deletedUser).toStrictEqual(user);
  });

  it("should call DeleteUserUseCase with correct params", async () => {
    const { sut, deleteUserRepository } = makeSut();
    const executeSpy = jest.spyOn(deleteUserRepository, "execute");
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });
});
