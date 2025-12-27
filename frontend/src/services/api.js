// API Service for Recipe App
// Build a base URL that works for both local dev (http) and hosted (often https).
// React env vars take priority; otherwise fall back to the current origin/port to avoid mixed-content errors.
const { RECIPES_BASE_URL, USERS_BASE_URL } = (() => {
  const stripTrailingSlash = (raw) => (raw ? raw.replace(/\/+$/, "") : null);

  // Remove any accidental path segment from REACT_APP_API_URL (e.g., "http://localhost:5000/recipes")
  const normalizeEnvRoot = (raw) => {
    if (!raw) return null;
    try {
      const url = new URL(raw.startsWith("http") ? raw : `http://${raw}`);
      url.pathname = "/";
      url.search = "";
      url.hash = "";
      return stripTrailingSlash(url.toString());
    } catch (_err) {
      return stripTrailingSlash(raw);
    }
  };

  const envRoot = normalizeEnvRoot(process.env.REACT_APP_API_URL);
  if (envRoot) {
    return {
      RECIPES_BASE_URL: `${envRoot}/recipes`,
      USERS_BASE_URL: `${envRoot}/users`,
    };
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const port = hostname === "localhost" || hostname === "127.0.0.1" ? 5000 : window.location.port;
    const root = stripTrailingSlash(`${protocol}//${hostname}${port ? `:${port}` : ""}`);
    return {
      RECIPES_BASE_URL: `${root}/recipes`,
      USERS_BASE_URL: `${root}/users`,
    };
  }

  const fallback = "http://localhost:5000";
  return {
    API_ROOT: fallback,
    RECIPES_BASE_URL: `${fallback}/recipes`,
    USERS_BASE_URL: `${fallback}/users`,
  };
})();

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (err) {
    return null;
  }
};

const handleResponse = async (response, defaultMessage) => {
  const data = await parseJson(response);
  if (!response.ok) {
    const message = (data && data.message) || defaultMessage;
    throw new Error(message);
  }
  return data;
};

// Get all recipes
export const getAllRecipes = async () => {
  try {
    const response = await fetch(`${RECIPES_BASE_URL}/`);
    return await handleResponse(response, "Failed to fetch recipes");
  } catch (error) {
    console.error("Error fetching recipes from", `${RECIPES_BASE_URL}/`, error);
    throw error;
  }
};

// Get recipe by ID
export const getRecipeById = async (id) => {
  try {
    const response = await fetch(`${RECIPES_BASE_URL}/${id}`);
    return await handleResponse(response, "Failed to fetch recipe");
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
};

// Add new recipe
export const addRecipe = async (recipeData) => {
  try {
    const isFormData = recipeData instanceof FormData;
    const requestOptions = {
      method: "POST",
      body: isFormData ? recipeData : JSON.stringify(recipeData),
    };

    if (!isFormData) {
      requestOptions.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await fetch(`${RECIPES_BASE_URL}/`, requestOptions);
    return await handleResponse(response, "Failed to add recipe");
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await fetch(`${RECIPES_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });
    return await handleResponse(response, "Failed to update recipe");
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`${RECIPES_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response, "Failed to delete recipe");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

// Search recipes by query (local backend)
export const searchRecipes = async (query) => {
  try {
    const url = `${RECIPES_BASE_URL}/search?q=${encodeURIComponent(query || "")}`;
    const response = await fetch(url);
    return await handleResponse(response, "Failed to search recipes");
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};

// User authentication
export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(`${USERS_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response, "Failed to sign up");
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${USERS_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response, "Failed to sign in");
};

// Search recipes from TheMealDB public API and normalize to app shape
export const searchExternalRecipes = async (query) => {
  if (!query || !query.trim()) return [];
  const q = query.trim();
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to search TheMealDB");
    const json = await response.json();
    const meals = json && Array.isArray(json.meals) ? json.meals : (json.meals ? json.meals : null);
    if (!meals) return [];

    // Map TheMealDB meal to our app's recipe shape
    return meals.map((m) => ({
      _id: `mealdb:${m.idMeal}`,
      externalId: m.idMeal,
      source: "external",
      name: m.strMeal || "Untitled Meal",
      image: m.strMealThumb || "",
      description: [m.strCategory, m.strArea].filter(Boolean).join(" • ") || (m.strInstructions ? m.strInstructions.slice(0, 120) + (m.strInstructions.length > 120 ? "…" : "") : ""),
      ingredients: extractIngredients(m).join(", "),
      instructions: m.strInstructions || "",
      cookTime: 0,
      servings: 1,
      video: m.strYoutube || "",
    }));
  } catch (error) {
    console.error("Error searching TheMealDB:", error);
    return [];
  }
};

// Helper to extract ingredients from TheMealDB meal object
function extractIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      list.push(meas && meas.trim() ? `${meas.trim()} ${ing.trim()}` : ing.trim());
    }
  }
  return list;
}
