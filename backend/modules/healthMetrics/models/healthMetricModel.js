const mongoose = require("mongoose");

const HealthMetricSchema = new mongoose.Schema({
  patientId: { type: Number, required: true },
  steps: { type: Number, required: true },
  calories: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  heartRate: { type: Number, required: true },
  date: { type: Date, required: true },
});

const HealthMetric = mongoose.model("HealthMetric", HealthMetricSchema);

module.exports = HealthMetric;

