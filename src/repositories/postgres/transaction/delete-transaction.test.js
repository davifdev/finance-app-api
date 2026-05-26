import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteTransactionRepository } from "./delete-transaction";
import { user } from "../../../__tests__/index.js";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";

describe("DeleteTransactionRepository", () => {
  const makeSut = () => {
    const sut = new PostgresDeleteTransactionRepository();

    return { sut };
  };

  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int(10),
  };

  it("should delete a transaction on db", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const { sut } = makeSut();

    const result = await sut.execute(transaction.id);

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

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();

    const prismaSpyOn = jest.spyOn(prisma.transaction, "delete");

    await sut.execute(transaction.id);

    expect(prismaSpyOn).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    });
  });
});
