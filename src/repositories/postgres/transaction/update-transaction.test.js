import { faker } from "@faker-js/faker";
import { PostgresUpdateTransactionRepository } from "./update-transaction";
import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../__tests__/index.js";
import dayjs from "dayjs";
import { TransactionNotFoundError } from "../../../errors/transaction.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

describe("UpdateTransactionRepository", () => {
  const makeSut = () => {
    const sut = new PostgresUpdateTransactionRepository();

    return { sut };
  };

  const updateTransactionsParams = {
    id: faker.string.uuid(),
    user_id: user.id,
    name: faker.lorem.words(6),
    date: faker.date.past().toISOString(),
    type: "EARNING",
    amount: faker.number.int({ min: 10, max: 99 }),
  };

  it("should update a transaction on db", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const { sut } = makeSut();

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

  it("should call Prisma with correct params", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const { sut } = makeSut();

    const prismaSpy = jest.spyOn(prisma.transaction, "update");

    await sut.execute(transaction.id, { ...transaction, user_id: user.id });

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: { ...transaction, user_id: user.id },
    });
  });

  it("should if Prisma throws", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const { sut } = makeSut();

    jest.spyOn(prisma.transaction, "update").mockRejectedValueOnce(new Error());

    const promise = sut.execute(transaction.id, {
      ...transaction,
      user_id: user.id,
    });

    await expect(promise).rejects.toThrow();
  });

  it("should throw TransactionNotFoundError if Prisma throws TransactionNotFoundError", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const { sut } = makeSut();

    jest
      .spyOn(prisma.transaction, "update")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      );

    const promise = sut.execute(transaction.id);

    expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transaction.id),
    );
  });
});
