const faker = require('faker');
const User = require('./../../../src/models/userModels');
const password = 'password';
const newUser = {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password,
    passwordConfirm: password,
}

test("New user", async () => {
    await expect(new User(newUser).validate()).resolves.toBeUndefined();
})