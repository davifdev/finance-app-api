import "dotenv/config";
import express from "express";
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "./controllers/index.js";

import {
  PostgresGetUserByIdRepository,
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresDeleteUserRepository,
  PostgresUpdateUserRepository,
} from "./repositories/postgres/index.js";

import {
  GetUserByIdUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  UpdateUserUseCase,
} from "./use-cases/index.js";

const app = express();

app.use(express.json());

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdUseRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdUseRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).json(body);
});

app.post("/api/users", async (request, response) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
  );
  const createUserController = new CreateUserController(createUserUseCase);

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  );
  const updateUserController = new UpdateUserController(updateUserUseCase);

  const { statusCode, body } = await updateUserController.execute(request);

  response.status(statusCode).json(body);
});

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  const { statusCode, body } = await deleteUserController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost${process.env.PORT}`);
});
