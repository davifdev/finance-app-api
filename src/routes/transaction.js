import { Router } from "express";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from "../factories/controllers/transaction.js";
import { auth } from "../middlewares/auth.js";

export const transactionsRouter = Router();

transactionsRouter.get("/me", auth, async (request, response) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } = await getTransactionByUserIdController.execute({
    ...request,
    query: {
      ...request.query,
      userId: request.userId,
      from: request.query.from,
      to: request.query.to,
    },
  });

  response.status(statusCode).json(body);
});

transactionsRouter.post("/me", auth, async (request, response) => {
  const createTransactionController = makeCreateTransactionController();

  const { statusCode, body } = await createTransactionController.execute({
    ...request,
    body: {
      ...request.body,
      user_id: request.userId,
    },
  });

  response.status(statusCode).json(body);
});

transactionsRouter.patch(
  "/me/:transactionId",
  auth,
  async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController();

    const { statusCode, body } = await updateTransactionController.execute({
      ...request,
      body: {
        ...request.body,
        user_id: request.userId,
      },
    });

    response.status(statusCode).json(body);
  },
);

transactionsRouter.delete(
  "/me/:transactionId",
  auth,
  async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController();

    const { statusCode, body } =
      await deleteTransactionController.execute(request);

    response.status(statusCode).json(body);
  },
);
