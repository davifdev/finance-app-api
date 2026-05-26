import { PostgresCreateUserRepository } from "./create-user.js";
import { user } from "../../../__tests__/index.js";
import { prisma } from "../../../../prisma/prisma.js";

describe("CreateUserRepository", () => {
  const makeSut = () => {
    const sut = new PostgresCreateUserRepository();

    return { sut };
  };
  it("should create a user on db", async () => {
    const { sut } = makeSut();
    const result = await sut.execute(user);

    expect(result).toBeTruthy();
    expect(result.id).toBe(user.id);
    expect(result.first_name).toBe(user.first_name);
    expect(result.last_name).toBe(user.last_name);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();
    const prismaSpy = jest.spyOn(prisma.user, "create");

    await sut.execute(user);

    expect(prismaSpy).toHaveBeenCalledWith({
      data: user,
    });
  });
});
