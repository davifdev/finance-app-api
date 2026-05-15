// import { PostgresHelper } from "../../../db/postgres/client.js";

import { prisma } from "../../../../prisma/prisma.js";

export class PostgresDeleteUserRepository {
  // async execute(userId) {
  //   const deletedUser = await PostgresHelper.query(
  //     "DELETE FROM users WHERE id = $1 RETURNING *",
  //     [userId],
  //   );

  //   return deletedUser[0];
  // }

  async execute(userId) {
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
