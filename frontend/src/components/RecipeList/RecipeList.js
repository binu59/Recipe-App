import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Edit2, Trash2, Eye, Clock, Users } from "lucide-react";
import { getAllRecipes, deleteRecipe } from "../../services/api";
import "./RecipeList.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return undefined;
    const sections = document.querySelectorAll("[data-nav-section]");
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.dispatchEvent(
              new CustomEvent("recipeappActiveSection", { detail: entry.target.id })
            );
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    window.dispatchEvent(new CustomEvent("recipeappActiveSection", { detail: "home" }));

    return () => observer.disconnect();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipe(id);
        setRecipes(recipes.filter((recipe) => recipe._id !== id));
      } catch (err) {
        alert("Failed to delete recipe");
      }
    }
  };

  // recipes already reflect server-side search results

  if (loading) {
    return <div className="loading">Loading delicious recipes...</div>;
  }

  return (
    <div className="recipe-list-container" id="home" data-nav-section>
      {error && <div className="error-message">{error}</div>}

      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found. Start by creating one!</p>
          <Link to="/add-recipe" className="btn btn-primary">
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id || recipe.id || recipe.externalId} className="recipe-card">
              <div className="recipe-image">
                <img src={recipe.image} alt={recipe.name} />
                <div className="recipe-overlay">
                  {recipe.source === "external" ? (
                    <a
                      href={recipe.video || `https://www.google.com/search?q=${encodeURIComponent(recipe.name + " recipe")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="overlay-btn view-btn"
                    >
                      <Eye size={20} />
                      View
                    </a>
                  ) : (
                    <>
                      <Link
                        to={`/recipe/${recipe._id}`}
                        className="overlay-btn view-btn"
                      >
                        <Eye size={20} />
                        View
                      </Link>
                      <Link
                        to={`/edit-recipe/${recipe._id}`}
                        className="overlay-btn edit-btn"
                      >
                        <Edit2 size={20} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe._id)}
                        className="overlay-btn delete-btn"
                      >
                        <Trash2 size={20} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="recipe-content">
                <h3 className="recipe-name">{recipe.name}</h3>
                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{recipe.cookTime ? `${recipe.cookTime} min` : "—"}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{recipe.servings ? `${recipe.servings} servings` : "—"}</span>
                  </div>
                </div>

                <div className="recipe-actions">
                  {recipe.source === "external" ? (
                    <a
                      href={recipe.video || `https://www.google.com/search?q=${encodeURIComponent(recipe.name + " recipe")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                    >
                      View Recipe
                    </a>
                  ) : (
                    <Link
                      to={`/recipe/${recipe._id}`}
                      className="btn btn-secondary"
                    >
                      View Recipe
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default RecipeList;
