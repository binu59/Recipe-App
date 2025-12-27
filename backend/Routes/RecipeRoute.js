
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

//Insert model

const Recipe = require("../Model/RecipeModel");

//insert recipe controller

const RecipeController = require("../Controller/RecipeController");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname);
		const sanitized = path.basename(file.originalname, extension).replace(/\s+/g, "-");
		cb(null, `${Date.now()}-${sanitized}${extension}`);
	},
});

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
		if (allowedMimeTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Only image files are allowed"));
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

router.get("/", RecipeController.getAllRecipes);

// Search endpoint: /recipes/search?q=term
router.get("/search", RecipeController.searchRecipes);

router.post("/", upload.single("image"), RecipeController.addRecipes);

router.get("/:id", RecipeController.getById)

router.put("/:id", RecipeController.updateRecipe)

router.delete("/:id", RecipeController.deleteRecipe)

//export
module.exports = router;