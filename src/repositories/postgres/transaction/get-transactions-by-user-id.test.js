import { prisma } from "../../../../prisma/prisma";
import { transaction, user } from "../../../__tests__/index.js";
import { PostgresGetTransactionByUserIdRepository } from "./get-transactions-by-user-id";
import dayjs from "dayjs";

describe("GetTransactionsByUserId", () => {
  const from = "2024-01-01";
  const to = "2026-02-01";

  const makeSut = () => {
    const sut = new PostgresGetTransactionByUserIdRepository();

    return { sut };
  };

  it("should get a transaction by user id on db", async () => {
    const { sut } = makeSut();
    await prisma.user.create({ data: user });
    await prisma.transaction.create({
      data: { ...transaction, user_id: user.id },
    });

    const result = await sut.execute(user.id, from, to);

    expect(result[0].id).toBe(transaction.id);
    expect(result[0].user_id).toBe(user.id);
    expect(result[0].name).toBe(transaction.name);
    expect(result[0].type).toBe(transaction.type);
    expect(result[0].amount.toString()).toBe(transaction.amount.toString());
    expect(dayjs(result[0].date).daysInMonth()).toBe(
      dayjs(transaction.date).daysInMonth(),
    );
    expect(dayjs(result[0].date).month()).toBe(dayjs(transaction.date).month());
    expect(dayjs(result[0].date).year()).toBe(dayjs(transaction.date).year());
  });

  it("should call Prisma with correct params", async () => {
    const { sut } = makeSut();

    const prismaSpy = import.meta.jest.spyOn(prisma.transaction, "findMany");

    await sut.execute(user.id, from, to);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: user.id,
        date: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
    });
  });

  it("should if Prisma throws", async () => {
    await prisma.user.create({ data: user });
    const { sut } = makeSut();

    import.meta.jest
      .spyOn(prisma.transaction, "findMany")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
