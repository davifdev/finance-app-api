import { prisma } from "../../../../prisma/prisma";
import { PostgresDeleteTransactionRepository } from "./delete-transaction";
import { transaction, user } from "../../../__tests__/index.js";
import dayjs from "dayjs";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { TransactionNotFoundError } from "../../../errors/transaction.js";

describe("DeleteTransactionRepository", () => {
  const makeSut = () => {
    const sut = new PostgresDeleteTransactionRepository();

    return { sut };
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
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });
    const { sut } = makeSut();

    const prismaSpyOn = import.meta.jest.spyOn(prisma.transaction, "delete");

    await sut.execute(transaction.id);

    expect(prismaSpyOn).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    });
  });

  it("should throw TransactionNotFoundError if Prisma throws TransactionNotFoundError", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.transaction, "delete")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      );

    const promise = sut.execute(transaction.id);

    expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transaction.id),
    );
  });

  it("should throw generic if Prisma throws generic error", async () => {
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.transaction, "delete")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(transaction.id);

    expect(promise).rejects.toThrow();
  });
});
