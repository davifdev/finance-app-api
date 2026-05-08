import { DeleteUserUseCase } from "../use-cases/delete-user";
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from "./helpers/index.js";

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id;
      const idIsValid = checkIfIdIsValid(userId);

      if (!idIsValid) {
        return invalidIdResponse();
      }

      const deleteUserUseCase = new DeleteUserUseCase();
      await deleteUserUseCase.execute(userId);

      return ok(deleteUserUseCase);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
