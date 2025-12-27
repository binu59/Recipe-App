
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({

    name : {

        type : String,
        required : true,
    },

    image : {

        type : String,
        required : true,
    },

    description : {

        type : String,
        required : true,
    },

    ingredients : {

        type : String,
        required : true,
    },

    instructions : {

        type : String,
        required : true,
    },

    cookTime : {

        type : Number,
        required : true,
    },

    servings : {

        type : Number,
        required : true,
    },

    video : {

        type : String,
        default: ""
    }
})

module.exports = mongoose.model(
    "RecipeModel",
    recipeSchema
)