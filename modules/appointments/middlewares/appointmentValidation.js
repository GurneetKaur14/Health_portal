// middlewares/appointmentValidation.js
const { body, validationResult } = require("express-validator");

// Validation rules for appointment fields
exports.appointmentValidationRules = [
  body("id")
    .notEmpty().withMessage("ID is required")
    .isInt({ gt: 0 }).withMessage("ID must be a positive integer"),

  body("patientName")
    .notEmpty().withMessage("Patient name is required")
    .isString().withMessage("Patient name must be a string")
    .isLength({ min: 2 }).withMessage("Patient name must be at least 2 characters"),

  body("doctor")
    .notEmpty().withMessage("Doctor name is required")
    .isString().withMessage("Doctor name must be a string"),

  body("date")
  .notEmpty().withMessage("Date is required")
  .matches(/^\d{4}-\d{2}-\d{2}$/)
  .withMessage("Date must be in YYYY-MM-DD format"),

  body("time")
    .notEmpty().withMessage("Time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?: ?[APMapm]{2})?$/)
    .withMessage("Time must be in valid format, e.g. '10:00 AM'"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "rejected", "cancelled"])
    .withMessage("Status must be one of: pending, confirmed, rejected, or cancelled")
];

// Middleware to handle validation errors
exports.validateAppointment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // 400 Bad Request
  }
  next();
};
