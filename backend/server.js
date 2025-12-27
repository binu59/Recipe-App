//DRaN0Z3280VhCl5W
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const recipeRouter = require("./Routes/RecipeRoute");
const userRouter = require("./Routes/UserRoute");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/recipes", recipeRouter);
app.use("/users", userRouter);

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to your .env file.");
    process.exit(1);
}

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Mongo connection error:", err);
        process.exit(1);
    }
}

startServer();