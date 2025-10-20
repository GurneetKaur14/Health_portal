const express = require("express");
const router = express.Router();

const model = require("../models/userModel");
const { userValidationRules, validateUser } = require("../middlewares/userValidation");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await model.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await model.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST new user
router.post("/", userValidationRules, validateUser, async (req, res) => {
  try {
    const newUser = await model.addNewUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update user
router.put("/:id", userValidationRules, validateUser, async (req, res) => {
  try {
    const updated = await model.updateExistingUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const success = await model.deleteUser(req.params.id);
    if (!success) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
