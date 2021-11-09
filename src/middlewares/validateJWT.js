const jwt = require('jsonwebtoken');

const secret = 'mySecret';

const validateJWT = async (req, _res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next({ code: 'noToken', message: 'missing auth token' });
  }

  try {
    const payload = jwt.verify(token, secret);
    const { id, role } = payload.data;
    req.user = { id, role };
    next();
  } catch (err) {
    return next({ code: 'jwtMalformed', message: 'jwt malformed' });
  }
};

module.exports = validateJWT;
