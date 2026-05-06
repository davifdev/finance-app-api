import "dotenv/config";
import express from "express";
import { CreateUserController } from "./controllers/create-user.js";

const app = express();

app.use(express.json());

app.post("/api/users", async (request, response) => {
  const createUserController = new CreateUserController();

  const { statusCode, body } = await createUserController.execute(request);

  response.status(statusCode).json(body);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost${process.env.PORT}`);
});
