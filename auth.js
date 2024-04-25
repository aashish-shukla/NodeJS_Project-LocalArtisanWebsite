// auth.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const database = require('./database');

// Secret key for JWT
const secretKey = 'your_secret_key';

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
};

// Function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

// Function to authenticate user
const authenticateUser = (username, password) => {
  const user = database.getUserByUsername(username);
  if (!user) {
    return null; // User not found
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return null; // Password does not match
  }
  return user;
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateUser
};
