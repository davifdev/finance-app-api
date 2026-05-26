import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../__tests__/index.js";
import { PostgresDeleteUserRepository } from "./delete-user";

describe("DeleteUserRepository", () => {
  const makeSut = () => {
    const sut = new PostgresDeleteUserRepository();

    return { sut };
  };

  it("should delete a user on db", async () => {
    await prisma.user.create({
      data: user,
    });

    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual(user);
  });
});
