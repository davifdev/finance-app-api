import bcrypt from "bcryptjs";
import {
  PostgresGetUserByEmailRepository,
  PostgresUpdateUserRepository,
} from "../repositories/postgres/index.js";

import { EmailAlreadyInUser } from "../errors/user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();

      const userWithProviderEmail =
        await postgresGetUserByEmailRepository.execute(updateUserParams.email);

      if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
        throw new EmailAlreadyInUser(updateUserParams.email);
      }
    }

    const user = {
      ...updateUserParams,
    };

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10);
      user.password = hashedPassword;
    }

    const postgresUpdateUserRepository = new PostgresUpdateUserRepository();
    const updatedUser = await postgresUpdateUserRepository.execute(
      userId,
      user,
    );

    return updatedUser;
  }
}
