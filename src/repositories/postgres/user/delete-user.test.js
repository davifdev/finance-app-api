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

  it("should call Prisma  with correct params", async () => {
    const { sut } = makeSut();
    const prismaSpy = jest.spyOn(prisma.user, "delete");

    await sut.execute(user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });

  it("should throw if DeleteUserRepository throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.user, "delete").mockImplementation(() => {
      throw new Error();
    });

    const result = await sut.execute(user.id);

    expect(result).toBeNull();
  });
});
