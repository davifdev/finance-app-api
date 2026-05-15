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
        type: "EXPENSE",
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
        type: "EARNING",
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
        type: "INVESTMENT",
      },
      _sum: {
        amount: true,
      },
    });

    const _totalEarnings = totalEarnings || 0;
    const _totalExpenses = totalExpenses || 0;
    const _totalInvestment = totalInvestment || 0;
    const balance = totalEarnings - totalExpenses - totalInvestment;

    return {
      _totalEarnings,
      _totalExpenses,
      _totalInvestment,
      balance,
    };
  }
}
