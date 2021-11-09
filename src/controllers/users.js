const usersService = require('../services/users');

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const emailExists = await usersService.emailAlreadyRegistered(email);

  if (emailExists) {
    return next({ code: 'emailExists', message: 'Email already registered' });
  }

  const newUser = await usersService.createUser(name, email, password);

  res.status(201).json(newUser);
};

const createAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;
  const { role } = req.user;

  const isRoleAdmin = usersService.isAdmin(role); 

  if (!isRoleAdmin) {
    return next({ code: 'notAdmin', message: 'Only admins can register new admins' });
  }
  
  const emailExists = await usersService.emailAlreadyRegistered(email);

  if (emailExists) {
    return next({ code: 'emailExists', message: 'Email already registered' });
  }

  const newAdmin = await usersService.createAdmin(name, email, password);

  res.status(201).json(newAdmin);
};

module.exports = { createUser, createAdmin };
