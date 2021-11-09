const entriesExists = (email, password) => {
  if (!email || !password) {
    return false;
  }

  return true;
};

const emailFormat = (email) => {
  if (!email || !(email.includes('@') || email.includes('.com'))) {
    return false;
  }

  return true;
};

const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  const entries = entriesExists(email, password);
  const validEmail = emailFormat(email);

  if (!entries || !validEmail) {
    return next({ code: 'invalidFields', message: 'All fields must be filled' });
  }

  next();
};

module.exports = validateLogin;
