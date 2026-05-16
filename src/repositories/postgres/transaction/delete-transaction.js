// import { PostgresHelper } from "../../../db/postgres/client.js";
import { prisma } from "../../../../prisma/prisma.js";
export class PostgresDeleteTransactionRepository {
  // async execute(transactionId) {
  //   const transaction = await PostgresHelper.query(
  //     "DELETE FROM transactions WHERE id = $1 RETURNING *",
  //     [transactionId],
  //   );

  //   return transaction[0];
  // }
  async execute(transactionId) {
    try {
      return await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
