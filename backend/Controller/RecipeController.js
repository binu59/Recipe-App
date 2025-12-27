const Recipe = require("../Model/RecipeModel");

/* ========================
   GET ALL RECIPES
======================== */
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    return res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

/* ========================
   SEARCH RECIPES
======================== */
const searchRecipes = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      const all = await Recipe.find();
      return res.status(200).json(all);
    }

    const regex = new RegExp(q, "i");

    const recipes = await Recipe.find({
      $or: [
        { name: regex },
        { description: regex },
        { ingredients: regex },
        { instructions: regex },
      ],
    });

    return res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to search recipes" });
  }
};

/* ========================
   ADD RECIPE (WITH IMAGE)
======================== */
const addRecipes = async (req, res) => {
  try {
    const { name, description, ingredients, instructions, cookTime, servings, video } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Recipe image is required" });
    }

    if (!name || !description || !ingredients || !instructions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const recipe = new Recipe({
      name: name.trim(),
      image: imageUrl,
      description: description.trim(),
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      cookTime: Number(cookTime),
      servings: Number(servings),
      video: video?.trim() || "",
    });

    await recipe.save();
    return res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add recipe" });
  }
};

/* ========================
   GET RECIPE BY ID
======================== */
const getById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

/* ========================
   UPDATE RECIPE
======================== */
const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update recipe" });
  }
};

/* ========================
   DELETE RECIPE
======================== */
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete recipe" });
  }
};

/* ========================
   EXPORTS
======================== */
module.exports = {
  getAllRecipes,
  searchRecipes,
  addRecipes,
  getById,
  updateRecipe,
  deleteRecipe,
};
