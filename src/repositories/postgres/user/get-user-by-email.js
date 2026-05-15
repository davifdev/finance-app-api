import { prisma } from "../../../../prisma/prisma.js";
// import { PostgresHelper } from "../../../db/postgres/client.js";

export class PostgresGetUserByEmailRepository {
  // async execute(email) {
  //   const user = await PostgresHelper.query(
  //     "SELECT * FROM users WHERE email = $1",
  //     [email],
  //   );

  //   return user[0];
  // }

  async execute(email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
