const { body, validationResult } = require("express-validator");

// Validation rules
const healthMetricValidationRules = [
  body("id").notEmpty().withMessage("id is required").isNumeric().withMessage("id must be a number"),
  body("patientId").notEmpty().withMessage("patientId is required").isNumeric().withMessage("patientId must be a number"),
  body("steps").notEmpty().withMessage("steps are required").isNumeric().withMessage("steps must be a number"),
  body("calories").notEmpty().withMessage("calories are required").isNumeric().withMessage("calories must be a number"),
  body("bloodPressure").notEmpty().withMessage("bloodPressure is required").isString().withMessage("bloodPressure must be a string"),
  body("heartRate").notEmpty().withMessage("heartRate is required").isNumeric().withMessage("heartRate must be a number"),
  body("date").notEmpty().withMessage("date is required").isISO8601().withMessage("date must be a valid date"),
];

// Middleware to handle validation
const validateHealthMetric = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { healthMetricValidationRules, validateHealthMetric };
