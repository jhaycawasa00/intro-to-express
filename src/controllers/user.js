const { createUser, authenticateUser } = require('../models/user');

const handleSignup = async (req, res, next) => {
  try {
    // Create a new user and return a token to the client
    const { token } = await createUser(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const handleLogin = async (req, res, next) => {
  try {
    // Authenticate the user and return a token to the client
    const { token } = await authenticateUser(req.body);
    // Imagine if the user is required to provide their login credentials every time they want to access our coveted recipes. This would not be an ideal user experience.
    // Instead, let's have our server issue a JWT to the client when a user signs up or logs in.
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleSignup,
  handleLogin,
};