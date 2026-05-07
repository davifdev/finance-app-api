import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { PostgresCreateUserRepository } from "../repositories/postgres/create-user.js";
import { PostgresGetUserEmaliByRepository } from "../repositories/postgres/get-user-by-email.js";

export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserEmaliByRepository();
    const userWithProviderEmail =
      await postgresGetUserByEmailRepository.execute(createUserParams.email);

    if (userWithProviderEmail) {
      throw Error("The provided email is already in use.");
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
