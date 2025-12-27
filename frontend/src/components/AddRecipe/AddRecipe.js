import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { addRecipe } from "../../services/api";
import "./AddRecipe.css";

function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    description: "",
    ingredients: "",
    instructions: "",
    cookTime: "",
    servings: "",
    video: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setFormData((prev) => ({
    ...prev,
    image: file,
  }));

  setImagePreview(URL.createObjectURL(file));

  if (errors.image) {
    setErrors((prev) => ({ ...prev, image: "" }));
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Recipe name is required";
    if (!formData.image) newErrors.image = "Recipe image is required";
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

  if (!validateForm()) return;

  try {
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.set("cookTime", parseInt(formData.cookTime));
    data.set("servings", parseInt(formData.servings));

    await addRecipe(data);
    navigate("/");
  } catch (error) {
    alert("Failed to add recipe. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="add-recipe-container">
      <div className="add-recipe-header">
        <button
          onClick={() => navigate("/")}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Add New Recipe</h1>
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
            
            <label htmlFor="image">Recipe Image *</label>
<input
  type="file"
  id="image"
  accept="image/*"
  onChange={handleImageChange}
  className={errors.image ? "error" : ""}
/>

{errors.image && <span className="error-text">{errors.image}</span>}

{imagePreview && (
  <div className="image-preview">
    <img src={imagePreview} alt="Preview" />
  </div>
)}

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
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Adding Recipe..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
