const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

const { userValidationRules, validateUser } = require("../middlewares/userValidation");

// Get all users (with search, sort, pagination)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "createdAt";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await User.countDocuments({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ],
    });

    if (count === 0) {
      return res.status(200).json({ count: 0, page: 1, data: [] });
    }

    const users = await User.find(
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
        ],
      },
      {},
      {
        limit,
        skip: (page - 1) * limit,
        sort: { [sort_by]: sort_order },
      }
    );

    res.status(200).json({ count, page, limit, data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Post adding new user
router.post("/", userValidationRules, validateUser, async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create user" });
  }
});

// Update user
router.put("/:id", userValidationRules, validateUser, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update user" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete user" });
  }
});

module.exports = router;
