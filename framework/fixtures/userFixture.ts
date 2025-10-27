import { faker } from '@faker-js/faker';

export function generateUserCredentials() {
  return {
    email: faker.internet.email(),
    password: '123Password!',
    username: faker.person.fullName()
  };
}