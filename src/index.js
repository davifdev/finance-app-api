import "dotenv/config";
import express from "express";

import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "./factories/controllers/user.js";
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from "./factories/controllers/transaction.js";

const app = express();

app.use(express.json());

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdController = makeGetUserByIdController();

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).json(body);
});

app.post("/api/users", async (request, response) => {
  const createUserController = makeCreateUserController();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = makeUpdateUserController();

  const { statusCode, body } = await updateUserController.execute(request);

  response.status(statusCode).json(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserController = makeDeleteUserController();

  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).json(body);
});

app.post("/api/transaction", async (request, response) => {
  const createTransactionController = makeCreateTransactionController();
  console.log(await createTransactionController.execute(request));

  const { statusCode, body } =
    await createTransactionController.execute(request);

  response.status(statusCode).json(body);
});

app.get("/api/transaction", async (request, response) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController();

  const { statusCode, body } =
    await getTransactionByUserIdController.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/transaction/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController();

  const { statusCode, body } =
    await updateTransactionController.execute(request);

  response.status(statusCode).json(body);
});

app.delete("/api/transaction/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController();

  const { statusCode, body } =
    await deleteTransactionController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost${process.env.PORT}`);
});
