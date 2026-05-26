import { Prisma, TransactionType } from "../../../../generated/prisma/index.js";
import { prisma } from "../../../../prisma/prisma.js";

// import { PostgresHelper } from "../../../db/postgres/client.js";
export class PostgresGetUserBalanceRepository {
  // async execute(userId) {
  //   const balance = await PostgresHelper.query(
  //     "SELECT * FROM get_user_balance($1)",
  //     [userId],
  //   );
  //   return {
  //     userId,
  //     ...balance[0],
  //   };
  // }
  async execute(userId) {
    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionType.EXPENSE,
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
