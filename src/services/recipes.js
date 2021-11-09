const recipesModel = require('../models/recipes');

const createRecipe = async (name, ingredients, preparation, id) => {
  const newRecipe = await recipesModel.createNewRecipe(name, ingredients, preparation, id);

  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await recipesModel.getAllRecipes();

  return recipes;
};

const getRecipeById = async (id) => {
  const recipe = await recipesModel.getRecipeById(id);

  return recipe;
};

const updateRecipe = async (recipeUpdateData) => {
  const { role, userId, recipeId } = recipeUpdateData;
  const recipeToUpdate = await getRecipeById(recipeId);
  
  if (recipeToUpdate && (role === 'admin' || recipeToUpdate.userId === userId)) {
    const recipe = await recipesModel.updateRecipe(recipeUpdateData);
  
    return recipe;
  }

  return null;
};

const deleteRecipe = async (recipeDeleteData) => {
  const { recipeId, userId, role } = recipeDeleteData;

  const recipeToDelete = await getRecipeById(recipeId);

  if (recipeToDelete && (role === 'admin' || recipeToDelete.userId === userId)) {
    const deletedRecipe = await recipesModel.deleteRecipe(recipeId);

    return deletedRecipe;
  }

  return null;
};

const uploadImage = async (recipeData) => {
  const { recipeId, userId, role, IMAGE_PATH } = recipeData;

  const recipe = await getRecipeById(recipeId);

  if (recipe && (role === 'admin' || recipe.userId === userId)) {
    const recipeWithImage = await recipesModel.uploadImage(recipeId, IMAGE_PATH);

    return recipeWithImage;
  }

  return null;
};

module.exports = { 
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
