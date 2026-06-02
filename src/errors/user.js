export class EmailAlreadyInUser extends Error {
  constructor(email) {
    super(`The email ${email} is already in use.`);
    this.name = "EmailAlreadyInUser";
  }
}
export class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User with id ${userId} not found.`);
    this.name = "UserNotFounError";
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super("Invalid password.");
    this.name = "InvalidPasswordError";
  }
}
