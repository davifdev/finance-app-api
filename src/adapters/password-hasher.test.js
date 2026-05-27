import { faker } from "@faker-js/faker";
import { PasswordHasherAdapter } from "./index.js";

describe("PasswordHasherAdapter", () => {
  it("should returns password hasher", async () => {
    const sut = new PasswordHasherAdapter();
    const password = faker.internet.password();

    const result = await sut.execute(password);

    expect(result).toBeTruthy();
    expect(result).not.toBe(password);
  });
});
