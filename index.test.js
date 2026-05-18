const sum = (num1, num2) => num1 + num2;

describe("Sum function", () => {
  it("should return the sum of two numbers", () => {
    // Arranger
    const num1 = 5;
    const num2 = 10;

    // Act
    const result = sum(num1, num2);

    // Assert
    expect(result).toBe(15);
  });
  it("shoul not return null or undefined", () => {
    const num1 = 5;
    const num2 = 10;

    const result = sum(num1, num2);

    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
  });
});
