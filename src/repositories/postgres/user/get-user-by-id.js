// import { PostgresHelper } from "../../../db/postgres/client.js";
import { prisma } from "../../../../prisma/prisma.js";
export class PostgresGetUserByIdRepository {
  // async execute(userId) {
  //   const user = await PostgresHelper.query(
  //     "SELECT * FROM users WHERE id = $1",
  //     [userId],
  //   );
  //   return user[0];
  // }

  async execute(userId) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
