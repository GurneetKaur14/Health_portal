const express = require("express");
const router = express.Router();

const model = require("../models/appointmentModel");
const { appointmentValidationRules, validateAppointment } = require("../middlewares/appointmentValidation");

// GET /api/appointments → all
router.get("/", async (req, res) => {
  try {
    const appointments = await model.getAllAppointments();
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/appointments/:id → single
router.get("/:id", async (req, res) => {
  try {
    const appointment = await model.getAppointmentById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/appointments → add new
router.post("/", appointmentValidationRules, validateAppointment, async (req, res) => {
  try {
    const newAppointment = await model.addNewAppointment(req.body);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /api/appointments/:id → update
router.put("/:id", appointmentValidationRules, validateAppointment, async (req, res) => {
  try {
    const updated = await model.updateExistingAppointment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE /api/appointments/:id → delete
router.delete("/:id", async (req, res) => {
  try {
    const success = await model.deleteAppointment(req.params.id);
    if (!success) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
