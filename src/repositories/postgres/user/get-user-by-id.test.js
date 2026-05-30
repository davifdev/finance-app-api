import { prisma } from "../../../../prisma/prisma.js";
import { user } from "../../../__tests__/index.js";
import { PostgresGetUserByIdRepository } from "./get-user-by-id.js";

describe("GetUserByIdRepository", () => {
  const makeSut = () => {
    const sut = new PostgresGetUserByIdRepository();

    return { sut };
  };

  it("should  get user by id", async () => {
    await prisma.user.create({ data: user });
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual(user);
  });

  it("should if Prisma throws", async () => {
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.user, "findUnique")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();
    const userId = user.id;
    const prismaSpy = import.meta.jest.spyOn(prisma.user, "findUnique");

    await sut.execute(userId);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
  });
});
