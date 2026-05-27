import request from "supertest";
import { app } from "../index.js";
import { user } from "../__tests__/fixtures/user.js";
import { faker } from "@faker-js/faker";

describe("Transaction Routes E2E Test", () => {
  it("POST /api/transactions should return 201 when creating a transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app).post("/api/transactions").send({
      name: "Salário",
      user_id: createdUser.id,
      date: "2026-05-19T18:30:00Z",
      amount: 10.5,
      type: "EARNING",
    });

    expect(response.status).toBe(201);
    expect(response.body.user_id).toBe(createdUser.id);
  });

  it("GET /api/transactions should return 200 when fetching transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    await request(app).post("/api/transactions").send({
      name: "Salário",
      user_id: createdUser.id,
      date: "2026-05-19T18:30:00Z",
      amount: 10.5,
      type: "EARNING",
    });

    const response = await request(app).get(
      `/api/transactions?userId=${createdUser.id}`,
    );

    expect(response.status).toBe(200);
  });

  it("PATCH /api/transactions/:transactionId should return 200 when updating transaction successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction } = await request(app)
      .post("/api/transactions")
      .send({
        name: "Salário",
        user_id: createdUser.id,
        date: "2026-05-19T18:30:00Z",
        amount: 10.5,
        type: "EARNING",
      });

    const response = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .send({ name: "Drop" });

    expect(response.status).toBe(200);
  });

  it("DELETE /api/transactions/:transactionId should return 200 when delete successfully", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const { body: createdTransaction } = await request(app)
      .post("/api/transactions")
      .send({
        name: "Salário",
        user_id: createdUser.id,
        date: "2026-05-19T18:30:00Z",
        amount: 10.5,
        type: "EARNING",
      });

    const response = await request(app).delete(
      `/api/transactions/${createdTransaction.id}`,
    );

    expect(response.status).toBe(200);
  });

  it("PATCH /api/transactions/:transactionId should return 404 if invalid id", async () => {
    const response = await request(app)
      .patch(`/api/transactions/${faker.string.uuid()}`)
      .send({ name: "Drop" });

    expect(response.status).toBe(404);
  });
});
