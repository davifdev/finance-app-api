import { UnauthorizedError } from "../../errors/user.js";
import { RefreshTokenUseCase } from "./refresh-token.js";

describe("RefreshTokenUseCase", () => {
  class TokensGeneratorAdapterStub {
    execute() {
      return {
        acessToken: "access_token",
        refreshToken: "refresh_token",
      };
    }
  }

  class TokenVerifierAdapterStub {
    execute() {
      return true;
    }
  }

  const makeSut = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
    const tokenVerifierAdapter = new TokenVerifierAdapterStub();

    const sut = new RefreshTokenUseCase(
      tokensGeneratorAdapter,
      tokenVerifierAdapter,
    );

    return {
      sut,
      tokensGeneratorAdapter,
      tokenVerifierAdapter,
    };
  };

  it("should return new tokens", async () => {
    const { sut } = makeSut();
    const refreshToken = "refresh_token";

    const result = await sut.execute(refreshToken);

    expect(result).toEqual({
      acessToken: "access_token",
      refreshToken: "refresh_token",
    });
  });

  it("should throw if tokenVerifierAdapter throws", async () => {
    const { sut, tokenVerifierAdapter } = makeSut();
    const refreshToken = "refresh_token";

    import.meta.jest
      .spyOn(tokenVerifierAdapter, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    await expect(() => sut.execute(refreshToken)).toThrow(
      new UnauthorizedError(),
    );
  });
});
