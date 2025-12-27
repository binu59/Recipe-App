import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getRecipeById, updateRecipe } from "../../services/api";
import "./EditRecipe.css";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookTime: "",
    servings: "",
    video: "",
  });

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await getRecipeById(id);
      const recipe = data.recipe || data;
      setFormData({
        name: recipe.name,
        image: recipe.image,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        video: recipe.video || "",
      });
      setLoading(false);
    } catch (error) {
      alert("Failed to load recipe");
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Recipe name is required";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.ingredients.trim()) newErrors.ingredients = "Ingredients are required";
    if (!formData.instructions.trim()) newErrors.instructions = "Instructions are required";
    if (!formData.cookTime || formData.cookTime <= 0) newErrors.cookTime = "Valid cook time is required";
    if (!formData.servings || formData.servings <= 0) newErrors.servings = "Valid servings are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await updateRecipe(id, {
        ...formData,
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
      });
      navigate(`/recipe/${id}`);
    } catch (error) {
      alert("Failed to update recipe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  return (
    <div className="edit-recipe-container">
      <div className="edit-recipe-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Edit Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="name">Recipe Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter recipe name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={errors.image ? "error" : ""}
            />
            {errors.image && <span className="error-text">{errors.image}</span>}
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your recipe"
              rows="3"
              className={errors.description ? "error" : ""}
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Cooking Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cookTime">Cooking Time (minutes) *</label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                placeholder="30"
                min="1"
                className={errors.cookTime ? "error" : ""}
              />
              {errors.cookTime && <span className="error-text">{errors.cookTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="servings">Servings *</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="4"
                min="1"
                className={errors.servings ? "error" : ""}
              />
              {errors.servings && <span className="error-text">{errors.servings}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Ingredients</h2>

          <div className="form-group">
            <label htmlFor="ingredients">
              Ingredients (one per line) *
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="2 cups flour&#10;1 cup sugar&#10;2 eggs"
              rows="6"
              className={errors.ingredients ? "error" : ""}
            ></textarea>
            {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>

          <div className="form-group">
            <label htmlFor="instructions">
              Instructions (one step per line) *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients"
              rows="6"
              className={errors.instructions ? "error" : ""}
            ></textarea>
            {errors.instructions && <span className="error-text">{errors.instructions}</span>}
          </div>
        </div>

        <div className="form-section">
          <h2>Optional</h2>

          <div className="form-group">
            <label htmlFor="video">Video URL (YouTube embed URL)</label>
            <input
              type="url"
              id="video"
              name="video"
              value={formData.video}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? "Updating Recipe..." : "Update Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipe;
