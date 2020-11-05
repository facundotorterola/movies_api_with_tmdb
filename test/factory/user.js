const faker = require('faker');

function user() {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
  };
}

function userWithoutEmail() {
  return {
    name: faker.name.findName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
  };
}

function userWithoutPassword() {
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };
}

module.exports = {
  user,
  userWithoutEmail,
  userWithoutPassword,
};
