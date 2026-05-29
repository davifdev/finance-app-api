import { faker } from "@faker-js/faker";

export const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  name: faker.lorem.words(6),
  date: faker.date.past().toISOString(),
  type: "EARNING",
  amount: faker.number.float({ min: 1, fractionDigits: 2 }),
};
