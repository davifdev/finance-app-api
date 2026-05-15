// import { PostgresHelper } from "../../../db/postgres/client.js";

import { prisma } from "../../../../prisma/prisma.js";

export class PostgresCreateUserRepository {
  // async execute(createUserParams) {
  //   await PostgresHelper.query(
  //     "INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)",
  //     [
  //       createUserParams.id,
  //       createUserParams.first_name,
  //       createUserParams.last_name,
  //       createUserParams.email,
  //       createUserParams.password,
  //     ],
  //   );
  //   const createdUser = await PostgresHelper.query(
  //     "SELECT * FROM users where id = $1",
  //     [createUserParams.id],
  //   );
  //   return createdUser[0];
  // }
  async execute(createUserParams) {
    const user = await prisma.user.create({
      data: {
        id: createUserParams.id,
        first_name: createUserParams.first_name,
        last_name: createUserParams.last_name,
        email: createUserParams.email,
        password: createUserParams.password,
      },
    });

    return user;
  }
}
