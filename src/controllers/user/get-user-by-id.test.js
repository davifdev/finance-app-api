import { faker } from "@faker-js/faker";
import { GetUserByIdController } from "./get-user-by-id";

describe("GetUserByIdController", () => {
  const makeSut = () => {
    class GetUserByIdUseCaseStub {
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

    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCaseStub);

    return {
      getUserByIdUseCaseStub,
      sut,
    };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  };

  it("should return 200 when getting user by id", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });
});
