import { faker } from "@faker-js/faker";

export const user = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

export const balance = {
  EARNINGS: "1000",
  EXPENSES: "1000",
  INVESTMENT: "1000",
  balance: "0",
};
