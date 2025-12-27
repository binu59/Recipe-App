import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, User } from "lucide-react";
import RecipeList from "../RecipeList/RecipeList";
import "./Profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero__content">
          
          <h1>My Recipe Vault</h1>
          <p>
            Manage favorites, tags, and personal notes so your go-to dishes are always within reach.
          </p>
          <div className="profile-hero__actions">
            <Link to="/add-recipe" className="btn btn--primary">Add new recipe</Link>
          </div>
          <div className="profile-hero__badges">
            
            
          </div>
        </div>
      </section>

      <section className="profile-collection">
        <div className="profile-vault__list-head">
          <div>
            <h2>Saved recipes</h2>
            
          </div>
          
        </div>
        <RecipeList />
      </section>
    </div>
  );
}

export default Profile;
