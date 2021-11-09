module.exports = (err, _req, res, _next) => {
  const { code, message } = err;
  
  const codeDictionaryError = {
    invalidEntries: 400,
    emailExists: 409,
    invalidFields: 401,
    incorrectLogin: 401,
    jwtMalformed: 401,
    recipeNotFound: 404,
    noToken: 401,
    invalidIdOrRole: 401,
    notAdmin: 403,
  };

  if (err.code) {
    return res.status(codeDictionaryError[code]).json({ message });
  }

  return res.status(500).json(err);
};
