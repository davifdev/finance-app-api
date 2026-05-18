import { CreateUserController } from "./create-user.js";

describe("CreateUserController", () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user;
    }
  }

  it("should return 201 when creating a user successfuly", async () => {
    // Arrange
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: "Davi",
        last_name: "Fernandes",
        email: "davi@gmail.com",
        password: "123456",
      },
    };

    // Act
    const result = await createUserController.execute(httpRequest);

    // Assert
    expect(result.statusCode).toBe(201);
    expect(result.body).not.toBeNull();
  });

  it("should return 400 if first_name is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        last_name: "Fernandes",
        email: "davi@gmail.com",
        password: "123456",
      },
    };

    const result = await createUserController.execute(httpRequest);
    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if last_name is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      first_name: "Davi",
      email: "davi@gmail.com",
      password: "123456",
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      first_name: "Davi",
      last_name: "Fernandes",
      password: "123456",
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if email is in the incorrect format", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      first_name: "Davi",
      last_name: "Fernandes",
      password: "123456",
      email: "incorrect_format",
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      first_name: "Davi",
      last_name: "Fernandes",
      email: "davi@gmail.com",
    };

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if password it is less than 6 characters", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      first_name: "Davi",
      last_name: "Fernandes",
      email: "davi@gmail.com",
      password: "123",
    };

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});
