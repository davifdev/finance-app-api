import fs from "fs";
import { pool } from "../client.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const execMigrations = async () => {
  const client = await pool.connect();
  try {
    const filePath = path.join(__dirname, "01-init.sql");
    const script = fs.readFileSync(filePath, "utf-8");

    await client.query(script);
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

execMigrations();
