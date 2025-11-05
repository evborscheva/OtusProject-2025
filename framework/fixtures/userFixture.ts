import { faker } from '@faker-js/faker';

export function generateUserCredentials() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 10,
      pattern: /[A-Za-z0-9!"#$*]/
    }),
    // password: '123Password!',
    username: faker.person.fullName()
  };
}
