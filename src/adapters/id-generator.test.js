import { IdGeneratorAdapter } from "./id-generator.js";
import validator from "validator";

describe("IdGeneratorAdapter", () => {
  it("should return a random id", async () => {
    const sut = new IdGeneratorAdapter();
    const result = await sut.execute();

    expect(result).toBeTruthy();
    expect(validator.isUUID(result)).toBe(true);
  });
});
