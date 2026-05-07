import bcrypt from "bcryptjs";
import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.ts";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";
import { EmailAlreadyInUser } from "../errors/user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository();

      const userWithProviderEmail = postgresGetUserByEmailRepository.execute(
        updateUserParams.email,
      );

      if (userWithProviderEmail) {
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
