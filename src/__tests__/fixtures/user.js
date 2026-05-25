import { faker } from "@faker-js/faker";

export const user = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
