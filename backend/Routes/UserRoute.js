const express = require("express");
const UserController = require("../Controller/UserController");

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);

module.exports = router;
