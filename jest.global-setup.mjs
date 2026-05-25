import { execSync } from "child_process";
import "dotenv/config";

export default async function globalSetup() {
  execSync("docker compose up -d --wait postgres-test");
  execSync("dotenv -e .env.test -- npx prisma db push");
}
