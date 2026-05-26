// import { PostgresHelper } from "../../../db/postgres/client.js";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../../../prisma/prisma.js";
import { UserNotFoundError } from "../../../errors/index.js";

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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundError(userId);
        }
      }

      throw error;
    }
  }
}
