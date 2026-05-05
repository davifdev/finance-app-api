import express from "express";
import { PostgresHelper } from "./db/postgres/client.js";

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  const results = await PostgresHelper.query("SELECT * FROM users;");
  res.send(JSON.stringify(results));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost${PORT}`);
});
