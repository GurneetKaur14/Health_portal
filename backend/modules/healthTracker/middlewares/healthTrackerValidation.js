const { body, validationResult } = require("express-validator");

// Validation rules for tracker
const healthTrackerValidationRules = [
  body("id")
    .notEmpty().withMessage("id is required")
    .isNumeric().withMessage("id must be a number"),

  body("goal")
    .notEmpty().withMessage("goal is required")
    .isString().withMessage("goal must be a string"),

  body("progress")
    .notEmpty().withMessage("progress is required")
    .isString().withMessage("progress must be a string"),

  body("status")
    .notEmpty().withMessage("status is required")
    .isIn(["In progress", "In Progress", "Completed", "Not Started"])
    .withMessage("status must be one of: In progress, In Progress, Completed, Not Started"),
];

// Middleware to handle validation
const validateHealthTracker = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { healthTrackerValidationRules, validateHealthTracker };
