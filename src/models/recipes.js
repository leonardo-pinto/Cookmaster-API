const { ObjectId } = require('mongodb');
const mongoConnection = require('./connection');

const dbConnection = async () => {
  const db = await mongoConnection.getConnection().then((conn) => conn.collection('recipes'));

  return db;
};

const createNewRecipe = async (name, ingredients, preparation, id) => {
  const db = await dbConnection();
  const newRecipe = await db.insertOne({ name, ingredients, preparation, userId: id });

  const { _id, userId } = newRecipe.ops[0];
  return {
    recipe: {
      name,
      ingredients,
      preparation,
      userId,
      _id,
    },
  };
};

const getAllRecipes = async () => {
  const db = await dbConnection();
  const recipes = await db.find().toArray();

  return recipes;
};

const getRecipeById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const db = await dbConnection();
  const recipe = await db.findOne({ _id: ObjectId(id) });
  if (!recipe) return null;

  return recipe;
};

const updateRecipe = async (recipeUpdateData) => {
  const {
    name,
    ingredients,
    preparation,
    recipeId,
    userId,
  } = recipeUpdateData;
  
  const db = await dbConnection();
  await db.findOneAndUpdate({ _id: ObjectId(recipeId) }, 
  { $set: { name, ingredients, preparation, userId } });

  return {
    _id: recipeId,
    name,
    ingredients,
    preparation,
    userId,
  };
};

const deleteRecipe = async (recipeId) => {
  if (!ObjectId.isValid(recipeId)) return null;
  const db = await dbConnection();
  await db.deleteOne({ _id: ObjectId(recipeId) });
  return true;
};

const uploadImage = async (recipeId, IMAGE_PATH) => {
  const db = await dbConnection();
  const { value } = await db.findOneAndUpdate({ _id: ObjectId(recipeId) }, 
  { $set: { image: IMAGE_PATH } });

  if (!value) return null;

  const { _id, name, ingredients, preparation, userId } = value;

  return {
    _id,
    name,
    ingredients,
    preparation,
    userId,
    image: IMAGE_PATH,
  };
};

module.exports = {
  createNewRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
