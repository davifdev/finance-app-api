import request from "supertest";
import { app } from "../index.cjs";
import { user } from "../__tests__/index.js";
import { faker } from "@faker-js/faker";
import { TransactionType } from "../../generated/prisma/index.js";

describe("User Routes E2E Tests", () => {
  it("POST /api/users should return 201 when user is created", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    expect(response.status).toBe(201);
  });

  it("GET /api/users/:userId should return 200 when user is found", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app).get(`/api/users/${createdUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(createdUser);
  });

  it("PATCH /api/users/:userId should return 200 when user is updated", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app)
      .patch(`/api/users/${createdUser.id}`)
      .send(updateUserParams);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(updateUserParams.first_name);
    expect(response.body.last_name).toBe(updateUserParams.last_name);
    expect(response.body.email).toBe(updateUserParams.email);
    expect(response.body.password).not.toBe(updateUserParams.password);
  });

  it("DELETE /api/users/:userId should return 200 when user is deleted", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app).delete(`/api/users/${createdUser.id}`);

    expect(response.status).toBe(200);
  });

  it("GET /api/users/:userId/balance returns 200 and correct balance", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      name: faker.lorem.words(),
      date: "2026-05-19T18:30:00Z",
      amount: 8000,
      type: TransactionType.EARNING,
    });

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      name: faker.lorem.words(),
      date: "2026-05-19T19:30:00Z",
      amount: 3000,
      type: TransactionType.EXPENSE,
    });

    await request(app).post("/api/transactions").send({
      user_id: createdUser.id,
      name: faker.lorem.words(),
      date: "2026-05-19T17:30:00Z",
      amount: 2000,
      type: TransactionType.INVESTMENT,
    });

    const response = await request(app).get(
      `/api/users/${createdUser.id}/balance`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      balance: "3000",
      earnings: "8000",
      expense: "3000",
      investment: "2000",
    });
  });

  it("GET /api/users/:userId should return 404 when user is not found", async () => {
    const response = await request(app).get(
      `/api/users/${faker.string.uuid()}`,
    );

    expect(response.status).toBe(404);
  });

  it("GET /api/users/:userId/balance should return 404 when user is not found", async () => {
    const response = await request(app).get(
      `/api/users/${faker.string.uuid()}/balance`,
    );

    expect(response.status).toBe(404);
  });

  it("PATCH /api/users/:userId should return 404 when user is not found", async () => {
    const response = await request(app)
      .patch(`/api/users/${faker.string.uuid()}`)
      .send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

    expect(response.status).toBe(404);
  });

  it("POST /api/users should return 400 when provided e-mail is already in user", async () => {
    await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
        email: "davi@gmail.com",
      });

    const response = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
        email: "davi@gmail.com",
      });

    expect(response.status).toBe(400);
  });
});
