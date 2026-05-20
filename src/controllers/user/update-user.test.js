import { faker } from "@faker-js/faker";
import { UpdateUserController } from "./update-user.js";

describe("UpdateUserController", () => {
  const makeSut = () => {
    class UpdateUserUseCaseStub {
      async execute() {
        return {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          password: faker.internet.password(),
        };
      }
    }

    const updateUserUseCaseStub = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCaseStub);

    return {
      updateUserUseCaseStub,
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

  it("should return 400 if user id is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(invalidHttpRequest);

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, updateUserUseCaseStub } = makeSut();

    jest.spyOn(updateUserUseCaseStub, "execute").mockResolvedValue(null);

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });
});
