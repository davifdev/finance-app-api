// import { PostgresHelper } from "../../../db/postgres/client.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../../../prisma/prisma.js";
import { TransactionNotFoundError } from "../../../errors/index.js";
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new TransactionNotFoundError(transactionId);
        }
      }

      throw error;
    }
  }
}
