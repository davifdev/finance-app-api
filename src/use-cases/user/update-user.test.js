import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "./update-user";

describe("UpdateUserUseCase", () => {
  const user = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    password: faker.internet.password(),
  };

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class UpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const sut = new UpdateUserUseCase(
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    );

    return {
      updateUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      sut,
    };
  };

  it("should update user successfully (without email and password)", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    });

    expect(result).toBe(user);
  });

  it("should update user successfully (with email)", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    const getUserByEmailRepositorySpy = jest.spyOn(
      getUserByEmailRepository,
      "execute",
    );

    const email = faker.internet.email();

    const result = await sut.execute(faker.string.uuid(), {
      email,
    });

    expect(result).toBe(user);
    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
  });
});
