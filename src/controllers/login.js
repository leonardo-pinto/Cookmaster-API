const jwt = require('jsonwebtoken');
const loginServices = require('../services/login');

const secret = 'mySecret';

const jwtConfiguration = {
  expiresIn: '2h',
  algorithm: 'HS256',
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await loginServices.login(email);
  
  if (!user || user.email !== email || user.password !== password) {
    return next({ code: 'incorrectLogin', message: 'Incorrect username or password' });
  }

  const { _id: id, role } = user;

  const token = jwt.sign({ data: { id, email, role } }, secret, jwtConfiguration);

  return res.status(200).json({ token });
};

module.exports = { login };
