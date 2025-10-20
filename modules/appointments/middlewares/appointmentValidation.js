const { body, validationResult } = require("express-validator");

// Validation rules
const appointmentValidationRules = [
  body("id").notEmpty().withMessage("patientId is required"),
  body("patientName").notEmpty().withMessage("patient name is required"),
  body("doctor").notEmpty().withMessage("doctor name is required"),
  body("date").notEmpty().withMessage("date is required"),
  body("time").notEmpty().withMessage("time is required"),
  body("status").optional().isIn(["pending", "confirmed", "rejected", "cancelled"])
    .withMessage("Invalid status")
];

// Middleware to check validation result
const validateAppointment = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

module.exports = { appointmentValidationRules, validateAppointment };

