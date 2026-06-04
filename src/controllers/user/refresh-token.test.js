import { UnauthorizedError } from "../../errors";
import { RefreshTokenController } from "./refresh-token";

describe("RefreshTokenController", () => {
  class RefreshTokenUseCaseStub {
    async execute() {
      return {
        accessToken: "access_token",
        refreshToken: "refresh_token",
      };
    }
  }

  const makeSut = () => {
    const refreshTokenUseCase = new RefreshTokenUseCaseStub();
    const sut = new RefreshTokenController(refreshTokenUseCase);

    return {
      sut,
      refreshTokenUseCase,
    };
  };

  const httpRequest = {
    body: {
      refreshToken: "valid_refresh_token",
    },
  };

  const invalidRequest = {
    body: {
      refreshToken: "",
    },
  };

  it("should return 400 if refreshToken is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(invalidRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 200 if refresh token is valid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });

  it("should return 401 if use case throws UnauthorizedError", async () => {
    const { sut, refreshTokenUseCase } = makeSut();

    import.meta.jest
      .spyOn(refreshTokenUseCase, "execute")
      .mockImplementationOnce(() => {
        throw new UnauthorizedError();
      });

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(401);
  });
});
