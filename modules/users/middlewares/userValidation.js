const { body, validationResult } = require("express-validator");

// Validation rules
const userValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("role").isIn(["patient", "doctor"]).withMessage("Role must be patient or doctor"),
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
