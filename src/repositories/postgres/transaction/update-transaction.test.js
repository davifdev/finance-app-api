import { faker } from "@faker-js/faker";
import { PostgresUpdateTransactionRepository } from "./update-transaction";
import { prisma } from "../../../../prisma/prisma";
import { user } from "../../../__tests__";
import dayjs from "dayjs";

describe("UpdateTransactionRepository", () => {
  const makeSut = () => {
    const sut = new PostgresUpdateTransactionRepository();

    return { sut };
  };

  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int({ min: 10, max: 999 }),
  };

  it("should update a transaction on db", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const { sut } = makeSut();

    const updateTransactionsParams = {
      id: faker.string.uuid(),
      user_id: user.id,
      name: faker.lorem.words(6),
      date: faker.date.past().toISOString(),
      type: "EARNING",
      amount: faker.number.int(10),
    };

    const result = await sut.execute(transaction.id, updateTransactionsParams);

    expect(result.id).toBe(updateTransactionsParams.id);
    expect(result.user_id).toBe(user.id);
    expect(result.name).toBe(updateTransactionsParams.name);
    expect(result.type).toBe(updateTransactionsParams.type);
    expect(result.amount.toString()).toBe(
      updateTransactionsParams.amount.toString(),
    );
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(updateTransactionsParams.date).daysInMonth(),
    );
    expect(dayjs(result.date).month()).toBe(
      dayjs(updateTransactionsParams.date).month(),
    );
    expect(dayjs(result.date).year()).toBe(
      dayjs(updateTransactionsParams.date).year(),
    );
  });
});
