import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { user as fixturesUser } from "../../../__tests__/index.js";
import { PostgresGetUserBalanceRepository } from "./get-user-balance.js";
import { TransactionType } from "../../../../generated/prisma/index.js";

describe("GetUserBalanceRepository", () => {
  const from = "2024-01-01";
  const to = "2026-02-01";
  const makeSut = () => {
    const sut = new PostgresGetUserBalanceRepository();

    return { sut };
  };

  it("should get user balance on db", async () => {
    const { sut } = makeSut();
    const user = await prisma.user.create({ data: fixturesUser });

    await prisma.transaction.createMany({
      data: [
        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 5000,
          type: "EARNING",
          user_id: user.id,
        },
        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 5000,
          type: "EARNING",
          user_id: user.id,
        },

        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
        {
          date: new Date(from),
          name: faker.lorem.words(1),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
      ],
    });

    const result = await sut.execute(user.id, from, to);

    expect(result.earnings.toString()).toBe("10000");
    expect(result.expense.toString()).toBe("2000");
    expect(result.investment.toString()).toBe("6000");
    expect(result.balance.toString()).toBe("2000");
  });

  it("should if Prisma throws", async () => {
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.transaction, "aggregate")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(fixturesUser.id, from, to);

    await expect(promise).rejects.toThrow();
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();

    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "aggregate");

    await sut.execute(fixturesUser.id, from, to);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: TransactionType.EXPENSE,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: TransactionType.EARNING,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: TransactionType.INVESTMENT,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
    });
  });
});
