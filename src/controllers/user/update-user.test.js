import { faker } from "@faker-js/faker";
import { UpdateUserController } from "./update-user.js";
import { EmailAlreadyInUser, UserNotFoundError } from "../../errors/user.js";
import { user } from "../../__tests__/index.js";

describe("UpdateUserController", () => {
  const makeSut = () => {
    class UpdateUserUseCaseStub {
      async execute() {
        return user;
      }
    }

    const updateUserUseCase = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCase);

    return {
      updateUserUseCase,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      password: faker.internet.password(),
    },
  };

  const invalidHttpRequest = {
    params: {
      userId: "invalid-user-id",
    },
  };

  it("should return 200 if user is updated", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });

  it("should call UpdateUserUseCase with correct params", async () => {
    const { sut, updateUserUseCase } = makeSut();

    const executeSpy = import.meta.jest.spyOn(updateUserUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    );
  });

  it("should return 400 when a invalid first_name is provided", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        first_name: "",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when a invalid last_name is provided", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        last_name: "",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when a invalid email is provided", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: "invalid-email",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("shoud return 400 when a invalid password is provided", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 3 }),
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if user id is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(invalidHttpRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if field is not allowed", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        not_allowed_field: "not allowed value",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, updateUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockResolvedValue(null);

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });

  it("should return 500 if ocurs an internal server error", async () => {
    const { sut, updateUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(500);
  });

  it("should return 404 if user not found", async () => {
    const { sut, updateUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockImplementation(() => {
        throw new UserNotFoundError();
      });

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });

  it("should return 400 if UpdateUserUseCase throws an error", async () => {
    const { sut, updateUserUseCase } = makeSut();

    import.meta.jest
      .spyOn(updateUserUseCase, "execute")
      .mockImplementation(() => {
        throw new EmailAlreadyInUser(faker.internet.email());
      });

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(400);
  });
});
