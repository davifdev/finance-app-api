import { faker } from "@faker-js/faker";
import { PostgresUpdateUserRepository } from "./update-user";
import { user as fixturesUser } from "../../../__tests__/index.js";
import { prisma } from "../../../../prisma/prisma.js";

describe("UpdateUserRepository", () => {
  const makeSut = () => {
    const sut = new PostgresUpdateUserRepository();

    return { sut };
  };

  it("should update user on db", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    const updateUserParams = {
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toStrictEqual(updateUserParams);
  });
});
