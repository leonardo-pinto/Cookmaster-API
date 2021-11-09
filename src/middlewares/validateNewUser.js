const entriesExists = (name, email, password) => {
  if (!name || !email || !password) {
    return false;
  }

  return true;
};

const entriesTypes = (name, email, password) => {
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
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

const validateNewUser = (req, _res, next) => {
  const { name, email, password } = req.body;

  const entries = entriesExists(name, email, password);
  const types = entriesTypes(name, email, password);
  const validEmail = emailFormat(email);

  if (!entries || !types || !validEmail) {
    return next({ code: 'invalidEntries', message: 'Invalid entries. Try again.' });
  }

  next();
};

module.exports = validateNewUser;
