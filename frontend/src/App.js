import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/home";
import Profile from "./components/profile/Profile";
import RecipeDetail from "./components/RecipeDetail/RecipeDetail";
import AddRecipe from "./components/AddRecipe/AddRecipe";
import EditRecipe from "./components/EditRecipe/EditRecipe";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
