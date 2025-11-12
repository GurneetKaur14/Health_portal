const express = require("express");
const router = express.Router();

const model = require("../models/appointmentModel");
const { appointmentValidationRules, validateAppointment } = require("../middlewares/appointmentValidation");

// GET /api/appointments → all
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "date";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Build filter for search
    const filter = {
      $or: [
        { patientName: { $regex: search, $options: "i" } },
        { doctor: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    };

    // Count total matching appointments
    const count = await model.countDocuments(filter);
    if (count === 0)
      return res.status(200).json({ count: 0, page: 1, data: [] });

    // Fetch paginated & sorted results
    const appointments = await model.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sort_by]: sort_order });

    res.status(200).json({ count, page, limit, data: appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/appointments/:id → single
router.get("/:id", async (req, res) => {
  try {
    const appointment = await model.findById(req.params.id);
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
    const newAppointment = await model.create(req.body);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /api/appointments/:id → update
router.put("/:id", appointmentValidationRules, validateAppointment, async (req, res) => {
  try {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
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
    const success = await model.findByIdAndDelete(req.params.id);
    if (!success) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
