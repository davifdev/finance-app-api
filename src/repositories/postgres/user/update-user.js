// import { PostgresHelper } from "../../../db/postgres/client.js";

import { prisma } from "../../../../prisma/prisma.js";
import { UserNotFoundError } from "../../../errors/index.js";

export class PostgresUpdateUserRepository {
  // async execute(userId, updateUserParams) {
  //   const updateFields = [];
  //   const updateValues = [];
  //   Object.keys(updateUserParams).forEach(key => {
  //     updateFields.push(`${key} = $${updateValues.length + 1}`);
  //     updateValues.push(updateUserParams[key]);
  //   });
  //   updateValues.push(userId);
  //   const updateQuery = `
  //   UPDATE users
  //   SET ${updateFields.join(", ")}
  //   WHERE id = $${updateValues.length}
  //   RETURNING *`;
  //   const updatedUser = await PostgresHelper.query(updateQuery, updateValues);
  //   return updatedUser[0];
  // }

  async execute(userId, updateUserParams) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateUserParams,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new UserNotFoundError(userId);
      }

      throw error;
    }
  }
}
