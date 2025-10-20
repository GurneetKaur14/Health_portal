const { body, validationResult } = require("express-validator");

// Validation rules
const healthMetricValidationRules = [
  body("id")
    .notEmpty().withMessage("id is required")
    .isInt({ gt: 0 }).withMessage("id must be a positive number"),

  body("patientId")
    .notEmpty().withMessage("patientId is required")
    .isInt({ gt: 0 }).withMessage("patientId must be a positive number"),

  body("steps")
    .notEmpty().withMessage("steps are required")
    .isInt({ min: 0 }).withMessage("steps must be 0 or greater"),

  body("calories")
    .notEmpty().withMessage("calories are required")
    .isInt({ min: 0 }).withMessage("calories must be 0 or greater"),

  body("bloodPressure")
    .notEmpty().withMessage("bloodPressure is required")
    .isString().withMessage("bloodPressure must be a string"),

  body("heartRate")
    .notEmpty().withMessage("heartRate is required")
    .isInt({ gt: 0 }).withMessage("heartRate must be a positive number"),

  body("date")
    .notEmpty().withMessage("date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("date must be in YYYY-MM-DD format")
];

// Middleware to handle validation
const validateHealthMetric = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { healthMetricValidationRules, validateHealthMetric };
