import { prisma } from "./prisma/prisma.js";

beforeEach(async () => {
  console.log("Running before each test...");
  await prisma.transaction.deleteMany({});
  await prisma.user.deleteMany({});
});
