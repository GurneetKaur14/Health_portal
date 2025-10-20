const express = require("express");
const router = express.Router();

const model = require("../models/userModel");
const { userValidationRules, validateUser } = require("../middlewares/userValidation");

// GET /api/users → Get all users
router.get("/", (req, res) => {
  const users = model.getAllUsers();
  res.status(200).json(users);
});

// GET /api/users/:id → Get single user
router.get("/:id", (req, res) => {
  const user = model.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

// POST /api/users → Add new user
router.post("/", userValidationRules, validateUser, (req, res) => {
  const newUser = model.addNewUser(req.body);
  res.status(201).json(newUser);
});

// PUT /api/users/:id → Update user
router.put("/:id", userValidationRules, validateUser, (req, res) => {
  const updated = model.updateExistingUser(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.status(200).json(updated);
});

// DELETE /api/users/:id → Delete user
router.delete("/:id", (req, res) => {
  const success = model.deleteUser(req.params.id);
  if (!success) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = router;
