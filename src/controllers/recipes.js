const path = require('path');
const recipesService = require('../services/recipes');

const createRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { id } = req.user;

  const newRecipe = await recipesService.createRecipe(name, ingredients, preparation, id);
 
  return res.status(201).json(newRecipe);
};

const getAllRecipes = async (_req, res) => {
  const recipes = await recipesService.getAllRecipes();

  return res.status(200).json(recipes);
};

const getRecipeById = async (req, res, next) => {
  const { id } = req.params;

  const recipe = await recipesService.getRecipeById(id);

  if (!recipe) {
    return next({ code: 'recipeNotFound', message: 'recipe not found' });
  }

  return res.status(200).json(recipe);
};

const updateRecipe = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { id: userId, role } = req.user;

  const recipe = await recipesService.updateRecipe({ ...req.body, recipeId, userId, role });

  if (!recipe) {
    return next({ code: 'invalidIdOrRole', message: 'invalid id or role to update the recipe' });
  }

  return res.status(200).json(recipe);
};

const deleteRecipe = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { id: userId, role } = req.user;

  const recipeDeleted = await recipesService.deleteRecipe({ recipeId, userId, role });

  if (!recipeDeleted) {
    return next({ code: 'invalidIdOrRole', message: 'invalid id or role to update the recipe' });
  }

  res.status(204).send();
};

const uploadImage = async (req, res, next) => {
  const { id: recipeId } = req.params;
  const { id: userId, role } = req.user;
  const IMAGE_PATH = path.join(`localhost:3000/src/uploads/${recipeId}.jpeg`);

  const upload = await recipesService.uploadImage({ recipeId, userId, role, IMAGE_PATH });

  if (!upload) {
    return next({ code: 'invalidIdOrRole', message: 'invalid id or role to update the recipe' });
  }

  res.status(200).json(upload);
};

module.exports = { 
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
