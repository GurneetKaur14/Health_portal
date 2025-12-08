const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../../shared/email-utils");

const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const { userValidationRules, validateUser } = require("../middlewares/userValidation");

const { generateToken } = require("../../../shared/jwt-utils");
const authorize = require("../../../shared/middlewares/authorize");

// ------------------ PUBLIC ROUTES ------------------

// REGISTER (public)
router.post("/register", userValidationRules(false), validateUser, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN step 1 (send OTP)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { userId: user._id },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    await sendEmail(email, "Your Health Portal Login OTP", `Your OTP is: ${otp}. It expires in 5 minutes.`);
    console.log("OTP sent to email:", otp);

    res.json({ message: "OTP has been sent to your email.", email });
  } catch (err) {
    console.error("Login (OTP step) error:", err);
    res.status(500).json({ message: "Login step 1 failed" });
  }
});

// LOGIN step 2 (verify OTP)
router.post("/verify-login", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await OTP.findOne({ userId: user._id });
    if (!otpRecord) return res.status(400).json({ message: "No OTP found. Please login again." });

    if (otpRecord.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const token = generateToken({ _id: user._id.toString(), role: user.role });

    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      message: "Login verified",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Verify-login error:", err);
    res.status(500).json({ message: "Login verification failed" });
  }
});

// ------------------ PROTECTED ROUTES ------------------

// GET all users (admin only)
router.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "createdAt";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ],
    };

    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sort_by]: sort_order });

    res.status(200).json({ count, page, limit, data: users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET current logged-in user
router.get("/me", authorize([]), async (req, res) => {
  res.json({ user: req.account });
});

// GET user by ID (admin only)
router.get("/:id", authorize(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Get user by id error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// CREATE user (admin only)
router.post("/", authorize(["admin"]), userValidationRules, validateUser, async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Could not create user" });
  }
});

// UPDATE user (admin only)
router.put("/:id", authorize(["admin"]), userValidationRules(true), validateUser, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Could not update user" });
  }
});

// DELETE user (admin only)
router.delete("/:id", authorize(["admin"]), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Could not delete user" });
  }
});

module.exports = router;
