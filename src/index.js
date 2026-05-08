import "dotenv/config";
import express from "express";
import {
  CreateUserController,
  GetUserByIdController,
  UpdateUserController,
} from "./controllers/index.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserController = new UpdateUserController();

  const { statusCode, body } = await updateUserController.execute(request);

  response.status(statusCode).json(body);
});

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdController = new GetUserByIdController();

  const { statusCode, body } = await getUserByIdController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost${process.env.PORT}`);
});
