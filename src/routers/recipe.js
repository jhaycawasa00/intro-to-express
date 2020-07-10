const express = require('express');
const router = express.Router();

const {
  deleteRecipe,
  getAllRecipes,
  getRecipe,
  saveRecipe,
  updateRecipe,
} = require('../controllers/recipe');

router.route('/').get(getAllRecipes).post(saveRecipe);
router.route('/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;