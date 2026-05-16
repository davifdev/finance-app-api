// import { PostgresHelper } from "../../../db/postgres/client.js";
import { prisma } from "../../../../prisma/prisma.js";
export class PostgresGetTransactionByUserIdRepository {
  // async execute(userId) {
  //   const transactions = await PostgresHelper.query(
  //     "SELECT * FROM transactions WHERE user_id = $1",
  //     [userId],
  //   );

  //   return transactions;
  // }
  async execute(userId) {
    return await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
    });
  }
}
