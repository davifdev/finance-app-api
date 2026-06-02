import { LoginUserUseCase } from "./login-user";
import { user } from "../../__tests__/index.js";
import { InvalidPasswordError, UserNotFoundError } from "../../errors/index.js";

describe("LoginUserUseCase", () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true;
    }
  }

  class TokensGeneratorAdapterStub {
    execute() {
      return {
        acessToken: "access_token",
        refreshToken: "refresh_token",
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapter = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
    const sut = new LoginUserUseCase(
      getUserByEmailRepository,
      passwordComparatorAdapter,
      tokensGeneratorAdapter,
    );

    return { getUserByEmailRepository, passwordComparatorAdapter, sut };
  };

  it("should throw UserNotFoundError if user is not found", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    import.meta.jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockResolvedValue(null);

    const promise = sut.execute(user.email, user.password);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it("should throw InvalidPasswordError if password is invalid", async () => {
    const { sut, passwordComparatorAdapter } = makeSut();

    import.meta.jest
      .spyOn(passwordComparatorAdapter, "execute")
      .mockResolvedValue(false);

    const promise = sut.execute(user.email, user.password);

    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });

  it("should return user with tokens", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.email, user.password);

    expect(result).toHaveProperty("tokens");
  });
});
