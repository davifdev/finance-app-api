import { faker } from "@faker-js/faker";
import { CreateUserController } from "./create-user.js";
import { EmailAlreadyInUser } from "../../errors/user.js";

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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    // Act
    const result = await createUserController.execute(httpRequest);

    // Assert
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(httpRequest.body);
  });

  it("should return 400 if first_name is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    const result = await createUserController.execute(httpRequest);
    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if last_name is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if email is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if email is in the incorrect format", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({ length: 7 }),
        email: "incorrect_format",
      },
    };

    const result = await createUserController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    };

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if password it is less than 6 characters", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 3 }),
      },
    };

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });

  it("should call CreateUserUseCase with correct params", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    const executeSpy = jest.spyOn(createUserUseCase, "execute");

    await createUserUseController.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if CreateUserUseCase throws an error", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    jest.spyOn(createUserUseCase, "execute").mockImplementation(() => {
      throw new Error("Server error");
    });

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should return 500 if CreateUserUseCase throws EmailAlreadyInUseError", async () => {
    const createUserUseCase = new CreateUserUseCaseStub();
    const createUserUseController = new CreateUserController(createUserUseCase);

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    };

    jest.spyOn(createUserUseCase, "execute").mockImplementation(() => {
      throw new EmailAlreadyInUser(httpRequest.body.email);
    });

    const result = await createUserUseController.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});
