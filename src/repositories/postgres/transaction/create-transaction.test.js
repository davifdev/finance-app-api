import { PostgresCreateTransactionRepository } from "./create-transaction.js";
import { prisma } from "../../../../prisma/prisma.js";
import { user as fixturesUser } from "../../../__tests__/index.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

describe("CreateTransactionRepository", () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int({ min: 10, max: 999 }),
  };

  const makeSut = () => {
    const sut = new PostgresCreateTransactionRepository();

    return { sut };
  };

  it("should create a transaction on db", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    const result = await sut.execute({ ...transaction, user_id: user.id });

    expect(result.id).toBe(transaction.id);
    expect(result.user_id).toBe(user.id);
    expect(result.name).toBe(transaction.name);
    expect(result.type).toBe(transaction.type);
    expect(result.amount.toString()).toBe(transaction.amount.toString());
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
  });

  it("should if Prisma throws", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    jest.spyOn(prisma.transaction, "create").mockRejectedValueOnce(new Error());

    const promise = sut.execute({ ...transaction, user_id: user.id });

    await expect(promise).rejects.toThrow();
  });

  it("should call Prisma with correct params", async () => {
    const user = await prisma.user.create({ data: fixturesUser });
    const { sut } = makeSut();

    const prismaSpy = jest.spyOn(prisma.transaction, "create");

    await sut.execute({ ...transaction, user_id: user.id });

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...transaction,
        user_id: user.id,
      },
    });
  });
});
