import { prisma } from "../../../../prisma/prisma.js";
import { TransactionNotFoundError } from "../../../errors/index.js";
export class PostgresDeleteTransactionRepository {
  async execute(transactionId) {
    try {
      return await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      });
    } catch (error) {
      console.error(error);

      if (error.code === "P2025") {
        throw new TransactionNotFoundError(transactionId);
      }

      throw error;
    }
  }
}
