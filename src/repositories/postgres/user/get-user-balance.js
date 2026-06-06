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

    const total = _totalEarnings.plus(_totalExpenses).plus(_totalInvestment);

    const balance = _totalEarnings
      .minus(_totalExpenses)
      .minus(_totalInvestment);

    const earningsPercentage = total.isZero()
      ? 0
      : _totalEarnings.div(total).times(100).floor();
    const expensesPercentage = total.isZero()
      ? 0
      : _totalExpenses.div(total).times(100).floor();
    const investmentPercentage = total.isZero()
      ? 0
      : _totalInvestment.div(total).times(100).floor();

    return {
      earnings: _totalEarnings,
      expense: _totalExpenses,
      investment: _totalInvestment,
      earningsPercentage,
      expensesPercentage,
      investmentPercentage,
      balance,
    };
  }
}
