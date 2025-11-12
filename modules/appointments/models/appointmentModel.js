const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = Appointment;
