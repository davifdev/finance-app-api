import request from "supertest";
import { app } from "../app.js";
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

  it("GET /api/users should return 200 when user is found", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .get(`/api/users`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdUser.id);
  });

  it("PATCH /api/users should return 200 when user is updated", async () => {
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
      .patch(`/api/users`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`)
      .send(updateUserParams);

    expect(response.status).toBe(200);
    expect(response.body.first_name).toBe(updateUserParams.first_name);
    expect(response.body.last_name).toBe(updateUserParams.last_name);
    expect(response.body.email).toBe(updateUserParams.email);
    expect(response.body.password).not.toBe(updateUserParams.password);
  });

  it("DELETE /api/users should return 200 when user is deleted", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app)
      .delete(`/api/users`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
  });

  it("GET /api/users/balance returns 200 and correct balance", async () => {
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

    const response = await request(app)
      .get(`/api/users/balance`)
      .set("Authorization", `Bearer ${createdUser.tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      balance: "3000",
      earnings: "8000",
      expense: "3000",
      investment: "2000",
    });
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

  it("POST /api/users/login should return 200 and tokens when user crendential are valid", async () => {
    const { body: createdUser } = await request(app)
      .post("/api/users")
      .send({
        ...user,
        id: undefined,
      });

    const response = await request(app).post("/api/users/login").send({
      email: createdUser.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });
});
