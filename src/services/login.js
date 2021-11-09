const loginModel = require('../models/login');

const login = async (email) => {
  const user = await loginModel.findUserByEmail(email);

  if (!user) {
    return false;
  }

  return user;
};

module.exports = { login };