const { body, validationResult } = require("express-validator");

// Validation rules
const userValidationRules = [
  body("id")
    .notEmpty().withMessage("Id is required")
    .isInt({ gt: 0 }).withMessage("Id must be a positive integer"),

  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["patient", "doctor"]).withMessage("Role must be patient or doctor")
];

// Middleware to handle validation result
const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { userValidationRules, validateUser };
