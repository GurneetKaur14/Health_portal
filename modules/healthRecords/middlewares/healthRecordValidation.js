const { body, validationResult } = require("express-validator");

// Validation rules for POST and PUT
const healthRecordValidationRules = [
  body("id").notEmpty().withMessage("Id is required"),
  body("patientId").notEmpty().withMessage("patientId is required"),
  body("doctorId").notEmpty().withMessage("doctorId is required"),
  body("diagnosis").notEmpty().withMessage("diagnosis is required"),
  body("prescription").notEmpty().withMessage("prescription is required"), // e.g., blood pressure, sugar
  body("date").notEmpty().withMessage("value is required"),
];

// Middleware to handle validation
const validateHealthRecord = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { healthRecordValidationRules, validateHealthRecord };
