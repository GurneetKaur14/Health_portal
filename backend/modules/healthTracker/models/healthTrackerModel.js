const mongoose = require("mongoose");

const HealthTrackerSchema = new mongoose.Schema({
  goal: { type: String, required: true },
  progress: { type: String, required: true },
  status: { type: String, default: "In progress" },
});

const HealthTracker = mongoose.model("HealthTracker", HealthTrackerSchema);

module.exports = HealthTracker;