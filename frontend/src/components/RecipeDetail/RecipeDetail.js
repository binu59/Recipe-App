import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Clock, Users, Video } from "lucide-react";
import { getRecipeById, deleteRecipe } from "../../services/api";
import "./RecipeDetail.css";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await getRecipeById(id);
      setRecipe(data.recipe || data);
      setError(null);
    } catch (err) {
      setError("Failed to load recipe details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipe(id);
        navigate("/");
      } catch (err) {
        alert("Failed to delete recipe");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-container">
        <div className="error-section">
          <p>{error || "Recipe not found"}</p>
          <Link to="/" className="btn btn-primary">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <div className="detail-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to Recipes
        </Link>
        <div className="header-actions">
          <Link to={`/edit-recipe/${id}`} className="btn btn-warning">
            <Edit2 size={18} />
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-image">
          <img src={recipe.image} alt={recipe.name} />
        </div>

        <div className="detail-info">
          <h1>{recipe.name}</h1>

          <div className="recipe-stats">
            <div className="stat">
              <Clock size={24} />
              <div>
                <span className="stat-label">Cooking Time</span>
                <span className="stat-value">{recipe.cookTime} minutes</span>
              </div>
            </div>
            <div className="stat">
              <Users size={24} />
              <div>
                <span className="stat-label">Servings</span>
                <span className="stat-value">{recipe.servings} people</span>
              </div>
            </div>
          </div>

          <section className="detail-section">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </section>

          <section className="detail-section">
            <h2>Ingredients</h2>
            <div className="ingredients-list">
              {recipe.ingredients.split("\n").map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <input type="checkbox" id={`ingredient-${index}`} />
                  <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                </div>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <h2>Instructions</h2>
            <div className="instructions-list">
              {recipe.instructions.split("\n").map((instruction, index) => (
                instruction.trim() && (
                  <div key={index} className="instruction-item">
                    <span className="step-number">{index + 1}</span>
                    <p>{instruction}</p>
                  </div>
                )
              ))}
            </div>
          </section>

          {recipe.video && (
            <section className="detail-section">
              <h2>
                <Video size={20} />
                Video Tutorial
              </h2>
              <div className="video-container">
                <iframe
                  src={recipe.video}
                  title="Recipe Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
