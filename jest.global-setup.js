import { execSync } from "child_process";
import "dotenv/config";

export default async function globalSetup() {
  execSync("docker compose --env-file .env-test up -d --wait postgres-test", {
    stdio: "inherit",
  });
  execSync("dotenv -e .env.test -- npx prisma db push");
}
