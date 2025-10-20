const express = require("express");
const router = express.Router();

const model = require("../models/appointmentModel");
const { appointmentValidationRules, validateAppointment } = require("../middlewares/appointmentValidation");

// GET /api/appointments → all
router.get("/", (req, res) => {
  const appointments = model.getAllAppointments();
  res.status(200).json(appointments);
});

// GET /api/appointments/:id → single
router.get("/:id", (req, res) => {
  const appointment = model.getAppointmentById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  res.status(200).json(appointment);
});

// POST /api/appointments → add new
router.post("/", appointmentValidationRules, validateAppointment, (req, res) => {
  const newAppointment = model.addNewAppointment(req.body);
  res.status(201).json(newAppointment);
});

// PUT /api/appointments/:id → update
router.put("/:id", appointmentValidationRules, validateAppointment, (req, res) => {
  const updated = model.updateExistingAppointment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Appointment not found" });
  res.status(200).json(updated);
});

// DELETE /api/appointments/:id → delete
router.delete("/:id", (req, res) => {
  const success = model.deleteAppointment(req.params.id);
  if (!success) return res.status(404).json({ message: "Appointment not found" });
  res.status(200).json({ message: "Appointment deleted successfully" });
});

module.exports = router;
