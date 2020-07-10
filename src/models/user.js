const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const path = require('path');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/');
const usersFilePath = path.join(__dirname, './users.json');

// Authenticate the user and return an authorization token for the user.
// We will use this function to authenticate a user who's logging in.
const authenticateUser = async ({ id, email, password }) => {
  const user = await findUser({ email });
  // Hash the user's password and compare the result with the hash saved in the database to see if the password is correct.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordValid) {
    throw new Error('Unable to login');
  }

  // Call jwt.sign(), which returns an authentication token.
  // The first argument is an object that contains the data to be embedded in the token. We can pass in a unique identifier for the user, such as the user's id stored in the database
  // The second argument is a string used to sign the token to ensure the token has not been tampered with, which could be any random series of characters
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token };
};

// Save the new user to the database and return an authorization token for the user
const createUser = async ({ email, name, password }) => {
  const data = await fs.readFile(usersFilePath);
  const users = JSON.parse(data);
  const user = await findUser({ email });

  if (user) {
    throw new Error('Email already exists!');
  }

  const newUser = {
    id: users.length + 1, // Not a robust database incrementor but will do for this exercise!
    email,
    name,
    // Here, we pass the user's password to bcrypt's hash function to create a hash, which is stored in the database instead of the user's original password. Hashing is a one-way operation, so the hash cannot be reversed to its original form.
    // The first argument is the password to be encrypted, and the second argument is the number of salt rounds. The higher the number of salt rounds used, the stronger the resulting hashed password becomes
    password: await bcrypt.hash(password, 10),
  };

  // Generate the JWT with jwt.sign(). The return value is an authentication token
  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN, // Currently set to expire in 24 hours
  });

  users.push(newUser);

  await fs.writeFile(usersFilePath, JSON.stringify(users));

  return { token };
};

const findUser = async ({ id, email }) => {
  const data = await fs.readFile(usersFilePath);
  const users = JSON.parse(data);

  const existingUser = users.find(
    user => user.id === id || user.email === email
  );

  return existingUser;
};

module.exports = {
  authenticateUser,
  createUser,
  findUser,
};