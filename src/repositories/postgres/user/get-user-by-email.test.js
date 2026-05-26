import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../__tests__/index.js";
import { PostgresGetUserByEmailRepository } from "./get-user-by-email";

describe("GetUserByEmailRepository", () => {
  const makeSut = () => {
    const sut = new PostgresGetUserByEmailRepository();

    return { sut };
  };

  it("should get user by email on db", async () => {
    await prisma.user.create({ data: user });
    const { sut } = makeSut();

    const result = await sut.execute(user.email);

    expect(result).toStrictEqual(user);
  });

  it("should if Prisma throws", async () => {
    const { sut } = makeSut();

    jest.spyOn(prisma.user, "findUnique").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.email);

    await expect(promise).rejects.toThrow();
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();
    const email = user.email;

    const prismaSpy = jest.spyOn(prisma.user, "findUnique");

    await sut.execute(email);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        email,
      },
    });
  });
});
