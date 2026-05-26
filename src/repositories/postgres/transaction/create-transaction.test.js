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
    amount: faker.number.int(10),
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
    expect(dayjs(result.date).month()).toBe(dayjs(result.date).month());
    expect(dayjs(result.date).year()).toBe(dayjs(result.date).year());
  });
});
