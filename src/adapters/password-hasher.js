import bcrypt from "bcryptjs";

export class PasswordHasherAdapter {
  async execute(password) {
    await bcrypt.hash(password, 10);
  }
}
