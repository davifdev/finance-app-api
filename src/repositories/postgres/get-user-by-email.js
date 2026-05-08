import { PostgresHelper } from "../../db/postgres/client.js";

export class PostgresGetUserByEmailRepository {
  async execute(email) {
    const user = await PostgresHelper.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    return user[0];
  }
}
