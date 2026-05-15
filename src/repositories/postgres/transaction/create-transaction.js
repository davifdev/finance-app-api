// import { PostgresHelper } from "../../../db/postgres/client.js";

import { prisma } from "../../../../prisma/prisma.js";

export class PostgresCreateTransactionRepository {
  // async execute(createTransactionParams) {
  //   const createdTransaction = await PostgresHelper.query(
  //     "INSERT INTO Transaction (id, user_id, name, date, amount, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
  //     [
  //       createTransactionParams.id,
  //       createTransactionParams.user_id,
  //       createTransactionParams.name,
  //       createTransactionParams.date,
  //       createTransactionParams.amount,
  //       createTransactionParams.type,
  //     ],
  //   );

  //   return createdTransaction[0];
  // }

  async execute(createTransactionParams) {
    return await prisma.transaction.create({
      data: createTransactionParams,
    });
  }
}
