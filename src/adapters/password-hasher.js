import bcrypt from "bcryptjs";
export class PasswordHasherAdapter {
  async execute(password) {
    return await bcrypt.hash(password, 10);
  }
}
