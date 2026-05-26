import { faker } from "@faker-js/faker";
import { prisma } from "../../../../prisma/prisma.js";
import { user as fixturesUser } from "../../../__tests__/index.js";
import { PostgresGetUserBalanceRepository } from "./get-user-balance.js";

describe("GetUserBalanceRepository", () => {
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
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 5000,
          type: "EARNING",
          user_id: user.id,
        },
        {
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 5000,
          type: "EARNING",
          user_id: user.id,
        },

        {
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 1000,
          type: "EXPENSE",
          user_id: user.id,
        },
        {
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
        {
          date: faker.date.past().toISOString(),
          name: faker.lorem.words(6),
          amount: 3000,
          type: "INVESTMENT",
          user_id: user.id,
        },
      ],
    });

    const result = await sut.execute(user.id);

    expect(result.earnings.toString()).toBe("10000");
    expect(result.expense.toString()).toBe("2000");
    expect(result.investment.toString()).toBe("6000");
    expect(result.balance.toString()).toBe("2000");
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();

    const prismaSpy = jest.spyOn(prisma.transaction, "aggregate");

    await sut.execute(fixturesUser.id);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: "EARNING",
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fixturesUser.id,
        type: "INVESTMENT",
      },
      _sum: {
        amount: true,
      },
    });
  });
});
