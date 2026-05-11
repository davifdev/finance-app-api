export class EmailAlreadyInUser extends Error {
  constructor(email) {
    super(`The email ${email} is already in use.`);
  }
}
export class UserNotFoundError extends Error {
  constructor(userId) {
    super(`User with id ${userId} not found.`);
    this.name = "UserNotFounError";
  }
}
