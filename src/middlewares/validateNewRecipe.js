const entriesExists = (name, ingredients, preparation) => {
  if (!name || !ingredients || !preparation) {
    return false;
  }

  return true;
};

const validateNewRecipe = (req, _res, next) => {
  const { name, ingredients, preparation } = req.body;

  const entries = entriesExists(name, ingredients, preparation);

  if (!entries) {
    return next({ code: 'invalidEntries', message: 'Invalid entries. Try again.' });
  }

  next();
};

module.exports = validateNewRecipe;
