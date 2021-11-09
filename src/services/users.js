const usersModel = require('../models/users');

const emailAlreadyRegistered = async (email) => {
  const emailExists = await usersModel.findEmail(email);

  if (emailExists) {
    return true;
  }

  return false;
};

const createUser = async (name, email, password) => {
  const newUser = await usersModel.createUser(name, email, password);

  return newUser;
};

const createAdmin = async (name, email, password) => {
  const newAdmin = await usersModel.createAdmin(name, email, password);

  return newAdmin;
};

const isAdmin = (role) => {
  if (role === 'admin') return true;

  return false;
};

module.exports = { 
  emailAlreadyRegistered,
  createUser,
  createAdmin,
  isAdmin,
};
