import { faker } from "@faker-js/faker";
import { PostgresUpdateUserRepository } from "./update-user";
import { user as fixturesUser } from "../../../__tests__/index.js";
import { prisma } from "../../../../prisma/prisma.js";
import { UserNotFoundError } from "../../../errors/user.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

describe("UpdateUserRepository", () => {
  const makeSut = () => {
    const sut = new PostgresUpdateUserRepository();

    return { sut };
  };

  const updateUserParams = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it("should update user on db", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    const result = await sut.execute(user.id, updateUserParams);

    expect(result).toStrictEqual(updateUserParams);
  });

  it("should if Prisma throws", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.user, "update")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, updateUserParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw UserNotFoundError if throws", async () => {
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.user, "update")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      );
    const promise = sut.execute(updateUserParams.id);

    await expect(promise).rejects.toThrow(
      new UserNotFoundError(updateUserParams.id),
    );
  });

  it("should call Prisma with correct params", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    const prismaSpy = import.meta.jest.spyOn(prisma.user, "update");

    await sut.execute(user.id, updateUserParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
      data: updateUserParams,
    });
  });
});
