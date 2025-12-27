const bcrypt = require("bcryptjs");
const User = require("../Model/UserModel");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to sign in" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

const getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users.map(sanitizeUser));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUsers,
  getUserById,
};
