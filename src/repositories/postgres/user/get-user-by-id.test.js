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

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();
    const userId = user.id;
    const prismaSpy = jest.spyOn(prisma.user, "findUnique");

    await sut.execute(userId);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: userId,
      },
    });
  });
});
