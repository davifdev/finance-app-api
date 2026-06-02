import { user } from "../../__tests__/index.js";
import { InvalidPasswordError, UserNotFoundError } from "../../errors/user.js";
import { LoginUserController } from "./login-user.js";

describe("LoginUserController", () => {
  class LoginUserUseCaseStub {
    async execute() {
      return {
        ...user,
        tokens: {
          accessToken: "access_token",
          refreshToken: "refresh_token",
        },
      };
    }
  }

  const makeSut = () => {
    const loginUserUseCase = new LoginUserUseCaseStub();
    const sut = new LoginUserController(loginUserUseCase);

    return {
      sut,
      loginUserUseCase,
    };
  };

  const httpRequest = {
    body: {
      email: user.email,
      password: user.password,
    },
  };

  it("should return 200 with user and tokens", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.tokens.accessToken).toBe("access_token");
    expect(response.body.tokens.refreshToken).toBe("refresh_token");
  });

  it("should return 401 if password is invalid", async () => {
    const { sut, loginUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(loginUserUseCase, "execute")
      .mockRejectedValue(new InvalidPasswordError());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, loginUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(loginUserUseCase, "execute")
      .mockRejectedValue(new UserNotFoundError());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });
});
