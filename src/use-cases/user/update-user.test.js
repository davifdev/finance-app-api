import { faker } from "@faker-js/faker";
import { UpdateUserUseCase } from "./update-user";
import { EmailAlreadyInUser } from "../../errors/user";
import { user } from "../../__tests__/index.js";

describe("UpdateUserUseCase", () => {
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

    const getUserByEmailRepositorySpy = import.meta.jest.spyOn(
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

  it("should update user successfully (with password)", async () => {
    const { sut, passwordHasherAdapter } = makeSut();

    const passwordHasheAdapterSpy = import.meta.jest.spyOn(
      passwordHasherAdapter,
      "execute",
    );

    const password = faker.internet.password();

    const result = await sut.execute(faker.string.uuid(), {
      password,
    });

    expect(result).toBe(user);
    expect(passwordHasheAdapterSpy).toHaveBeenCalledWith(password);
  });

  it("should throw EmailAreadyInUserError if email is already in use", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    import.meta.jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockResolvedValue(user);

    const email = faker.internet.email();
    const promise = sut.execute(faker.string.uuid(), {
      email,
    });

    await expect(promise).rejects.toThrow(new EmailAlreadyInUser(email));
  });

  it("should call UpdateUserRepository with correct params", async () => {
    const { sut, updateUserRepository } = makeSut();

    const updateUserRepositorySpy = import.meta.jest.spyOn(
      updateUserRepository,
      "execute",
    );

    const updateUserParams = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: "hashed_password",
    };

    await sut.execute(user.id, updateUserParams);

    expect(updateUserRepositorySpy).toHaveBeenCalledWith(
      user.id,
      updateUserParams,
    );
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    import.meta.jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid, {
      email: user.email,
    });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    import.meta.jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid, {
      email: user.email,
    });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if UpdateUserRepository throws", async () => {
    const { sut, updateUserRepository } = makeSut();

    import.meta.jest
      .spyOn(updateUserRepository, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const promise = sut.execute(faker.string.uuid, user);

    await expect(promise).rejects.toThrow();
  });
});
