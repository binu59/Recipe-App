import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Home, UtensilsCrossed, User, Info, Mail } from "lucide-react";
import "./Header.css";

function Header() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handler = (event) => {
      setActiveSection(event?.detail || "");
    };
    window.addEventListener("recipeappActiveSection", handler);
    return () => window.removeEventListener("recipeappActiveSection", handler);
  }, []);

  const navClass = (section, extra = "") => {
    const classes = ["nav-link"];
    if (extra) classes.push(extra);
    if (section && section === activeSection) classes.push("nav-link--active");
    return classes.join(" ");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <UtensilsCrossed size={28} />
          <span>RecipeApp</span>
        </Link>
        <nav className="nav-menu">
          <Link to="/" className={navClass("home")}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/add-recipe" className={navClass(null, "add-recipe-btn")}>
            <Plus size={20} />
            <span>Add Recipe</span>
          </Link>
          <Link to="/#about-us" className={navClass("about-us")}>
            <Info size={20} />
            <span>About Us</span>
          </Link>
          <Link to="/#contact" className={navClass("contact")}>
            <Mail size={20} />
            <span>Contact Us</span>
          </Link>
          <Link to="/profile" className={navClass(null, "profile-btn")}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
