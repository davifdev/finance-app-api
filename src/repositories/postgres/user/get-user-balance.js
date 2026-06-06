import { Prisma, TransactionType } from "../../../../generated/prisma/index.js";
import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetUserBalanceRepository {
  async execute(userId, from, to) {
    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
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

    const {
      _sum: { amount: totalEarnings },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
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

    const {
      _sum: { amount: totalInvestment },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
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

    const _totalEarnings = totalEarnings || new Prisma.Decimal(0);
    const _totalExpenses = totalExpenses || new Prisma.Decimal(0);
    const _totalInvestment = totalInvestment || new Prisma.Decimal(0);
    const balance = new Prisma.Decimal(
      totalEarnings - totalExpenses - totalInvestment,
    );

    return {
      earnings: _totalEarnings,
      expense: _totalExpenses,
      investment: _totalInvestment,
      balance,
    };
  }
}
