const router = require('express').Router();
const validateJWT = require('../middlewares/validateJWT');
const validateNewRecipe = require('../middlewares/validateNewRecipe');
const recipesController = require('../controllers/recipes');
const { upload } = require('../middlewares/uploadImage');

router.put('/:id/image', validateJWT, upload, recipesController.uploadImage);
router.post('/', validateJWT, validateNewRecipe, recipesController.createRecipe);
router.get('/:id', recipesController.getRecipeById);
router.get('/', recipesController.getAllRecipes);
router.put('/:id', validateJWT, recipesController.updateRecipe);
router.delete('/:id', validateJWT, recipesController.deleteRecipe);
module.exports = router;
