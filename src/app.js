import "dotenv/config";
import express from "express";
import { usersRouter, transactionsRouter } from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import { join, dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);

const swaggerDocument = JSON.parse(
  fs.readFileSync(join(__dirname, "../docs/swagger.json"), "utf-8"),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
