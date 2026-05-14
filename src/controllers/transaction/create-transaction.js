import { badRequest, created, serverError } from "../helpers/index.js";
import { createTransactionSchema } from "../../schemas/index.js";
import { ZodError } from "zod";
import { UserNotFoundError } from "../../errors/user.js";

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body;

      await createTransactionSchema.parseAsync(params);

      const transaction = await this.createTransactionUseCase.execute(params);

      return created(transaction);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest({
          message: error.issues[0].message,
        });
      }
      if (error instanceof UserNotFoundError) {
        return badRequest({
          message: error.message,
        });
      }
      return serverError();
    }
  }
}
