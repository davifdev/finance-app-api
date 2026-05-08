import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import { EmailAlreadyInUser } from "../errors/user.js";

export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepository();
    const userWithProviderEmail =
      await postgresGetUserByEmailRepository.execute(createUserParams.email);

    if (userWithProviderEmail) {
      throw new EmailAlreadyInUser(createUserParams.email);
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    const postgresCreateUserRepository = new PostgresCreateUserRepository();

    const createrUser = await postgresCreateUserRepository.execute(user);
    return createrUser;
  }
}
