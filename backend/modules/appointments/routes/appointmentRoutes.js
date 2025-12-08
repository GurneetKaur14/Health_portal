const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointmentModel");
const User = require("../../users/models/userModel");

const authorize = require("../../../shared/middlewares/authorize");
const {
  appointmentValidationRules,
  validateAppointment,
} = require("../middlewares/appointmentValidation");

// GET all appointments (admin/doctor/patient)
router.get(
  "/",
  authorize(["admin", "doctor", "patient"]),
  async (req, res) => {
    try {
      const search = req.query.search || "";
      const sort_by = req.query.sort_by || "date";
      const sort_order = req.query.sort_order === "asc" ? 1 : -1;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const user = req.account; // decoded token from authorize middleware
      const filter = {
        $or: [
          { patientName: { $regex: search, $options: "i" } },
          { doctorName: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ],
      };

      // Filter by role
      if (user.role === "doctor") {
        filter.doctorId = user._id; // only this doctor's appointments
      } else if (user.role === "patient") {
        filter.patientId = user._id; // only this patient's appointments
      }
      // Admin sees all, no extra filter

      const count = await Appointment.countDocuments(filter);

      const appointments = await Appointment.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ [sort_by]: sort_order });

      res.json({ count, page, limit, data: appointments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// GET single appointment by id
router.get(
  "/:id",
  authorize(["admin", "doctor", "patient"]),
  async (req, res) => {
    try {
      const app = await Appointment.findById(req.params.id);
      if (!app)
        return res.status(404).json({ message: "Appointment not found" });
      res.json(app);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


router.post(
  "/",
  authorize(["patient"]),
  async (req, res) => {
    try {
      const { doctorId, date, time } = req.body;
      if (!doctorId || !date || !time) {
        return res
          .status(400)
          .json({ message: "doctorId, date and time are required" });
      }

      const patientId = req.account._id; // updated
      const patient = await User.findById(patientId);
      const doctor = await User.findById(doctorId);

      if (!patient || !doctor) {
        return res
          .status(404)
          .json({ message: "Patient or Doctor not found" });
      }

      if (doctor.role !== "doctor") {
        return res
          .status(400)
          .json({ message: "Selected user is not a doctor" });
      }

      const newAppointment = await Appointment.create({
        patientId,
        doctorId,
        patientName: patient.name,
        doctorName: doctor.name,
        date,
        time,
        status: "pending",
      });

      res.status(201).json(newAppointment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// PATIENT: view only their own appointments
router.get(
  "/my",
  authorize(["patient"]),
  async (req, res) => {
    try {
      const patientId = req.account._id;
      const appointments = await Appointment.find({ patientId }).sort({ date: 1 });
      res.json(appointments);
    } catch (err) {
      console.error("Error fetching patient's appointments:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// DOCTOR: view only their own appointments
router.get(
  "/doctor",
  authorize(["doctor"]),
  async (req, res) => {
    try {
      const doctorId = req.account._id;
      const appointments = await Appointment.find({ doctorId }).sort({ date: 1 });
      res.json(appointments);
    } catch (err) {
      console.error("Error fetching doctor's appointments:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.put(
  "/:id/status",
  authorize(["admin", "doctor"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      const user = req.account;
      if (user.role === "doctor" && appointment.doctorId.toString() !== user._id) {
        return res.status(403).json({ message: "Not authorized to update this appointment" });
      }

      appointment.status = status;
      await appointment.save();

      res.json({ message: "Appointment status updated successfully", appointment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// UPDATE appointment
router.put(
  "/:id",
  authorize(["admin", "doctor", "patient"]),
  async (req, res) => {
    try {
      const allowedUpdates = ["date", "time", "status"];
      const filteredBody = {};

      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          filteredBody[field] = req.body[field];
        }
      });

      const updated = await Appointment.findByIdAndUpdate(
        req.params.id,
        filteredBody,
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ message: "Appointment not found" });

      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


// DELETE appointment
router.delete(
  "/:id",
  authorize(["admin", "doctor"]),
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found" });

      const user = req.account;

      // Only admin or doctor who owns the appointment can delete
      if (user.role === "doctor" && appointment.doctorId.toString() !== user._id) {
        return res.status(403).json({ message: "Not authorized to delete this appointment" });
      }

      await Appointment.findByIdAndDelete(req.params.id);
      res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


module.exports = router;
