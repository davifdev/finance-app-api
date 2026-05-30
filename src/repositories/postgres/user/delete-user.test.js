import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../__tests__/index.js";
import { PostgresDeleteUserRepository } from "./delete-user";
import { UserNotFoundError } from "../../../errors/user.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
    await prisma.user.create({ data: user });
    const { sut } = makeSut();
    const prismaSpy = import.meta.jest.spyOn(prisma.user, "delete");

    await sut.execute(user.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
    });
  });

  it("should throw if DeleteUserRepository throws", async () => {
    const { sut } = makeSut();

    import.meta.jest.spyOn(prisma.user, "delete").mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  it("should throw UserNotFoundError if Prisma throw UserNotFoundError", async () => {
    await prisma.user.create({
      data: user,
    });
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.user, "delete")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });
});
