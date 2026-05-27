import { Router } from "express";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from "../factories/controllers/transaction.js";

export const transactionsRouter = Router();

transactionsRouter.post("", async (request, response) => {
  const createTransactionController = makeCreateTransactionController();

  const { statusCode, body } =
    await createTransactionController.execute(request);

  response.status(statusCode).json(body);
});

transactionsRouter.get("/", async (request, response) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } =
    await getTransactionByUserIdController.execute(request);

  response.status(statusCode).json(body);
});

transactionsRouter.patch("/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();

  const { statusCode, body } =
    await updateTransactionController.execute(request);

  response.status(statusCode).json(body);
});

transactionsRouter.delete("/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();

  const { statusCode, body } =
    await deleteTransactionController.execute(request);

  response.status(statusCode).json(body);
});
