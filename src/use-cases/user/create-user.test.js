import { CreateUserUseCase } from "./create-user";
import { EmailAlreadyInUser } from "../../errors/user";
import { user } from "../../__tests__/index.js";

describe("CreateUserUseCase", () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }
  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return "generated_id";
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    );

    return {
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
      sut,
    };
  };

  it("should successfully create a user", async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute(user);

    expect(createdUser).toBeTruthy();
  });

  it("should throw an EmailAlreadyInUser if GetUserByEmailRepository returns a user", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    jest.spyOn(getUserByEmailRepository, "execute").mockReturnValue(user);

    const emailAlreadyInUser = sut.execute(user);

    expect(emailAlreadyInUser).rejects.toThrow(
      new EmailAlreadyInUser(user.email),
    );
  });

  it("should call IdGeneratorAdapter to generate random id", async () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();

    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, "execute");

    const createUserSpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserSpy).toHaveBeenCalledWith({
      ...user,
      id: "generated_id",
      password: "hashed_password",
    });
  });

  it("should call PasswordHasherAdapter to cryptograph password", async () => {
    const { sut, createUserRepository, passwordHasherAdapter } = makeSut();

    const passwordHahserSpy = jest.spyOn(passwordHasherAdapter, "execute");
    const createUserSpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(passwordHahserSpy).toHaveBeenCalled();
    expect(createUserSpy).toHaveBeenCalledWith({
      ...user,
      id: "generated_id",
      password: "hashed_password",
    });
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockRejectedValue(new Error());

    const promise = sut.execute();

    await expect(promise).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    const { sut, idGeneratorAdapter } = makeSut();

    jest.spyOn(idGeneratorAdapter, "execute").mockImplementation(() => {
      new Error();
    });

    const promise = sut.execute();

    await expect(promise).rejects.toThrow();
  });

  it("should throw if PasswordHasherAdapter throws", async () => {
    const { sut, passwordHasherAdapter } = makeSut();

    jest.spyOn(passwordHasherAdapter, "execute").mockRejectedValue(new Error());

    const promise = sut.execute();

    await expect(promise).rejects.toThrow();
  });
});
