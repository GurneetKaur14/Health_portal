const express = require("express");
const router = express.Router();

const model = require("../models/healthTrackerModel");
const { healthTrackerValidationRules, validateHealthTracker } = require("../middlewares/healthTrackerValidation");

// GET all trackers
router.get("/", (req, res) => {
  const trackers = model.getAllHealthTrackers();
  res.status(200).json(trackers);
});

// GET single tracker by ID
router.get("/:id", (req, res) => {
  const tracker = model.getHealthTrackerById(req.params.id);
  if (!tracker) return res.status(404).json({ message: "Health tracker not found" });
  res.status(200).json(tracker);
});

// POST new tracker
router.post("/", healthTrackerValidationRules, validateHealthTracker, (req, res) => {
  const newTracker = model.addNewHealthTracker(req.body);
  res.status(201).json(newTracker);
});

// PUT update tracker
router.put("/:id", healthTrackerValidationRules, validateHealthTracker, (req, res) => {
  const updated = model.updateExistingHealthTracker(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Health tracker not found" });
  res.status(200).json(updated);
});

// DELETE tracker
router.delete("/:id", (req, res) => {
  const success = model.deleteHealthTracker(req.params.id);
  if (!success) return res.status(404).json({ message: "Health tracker not found" });
  res.status(200).json({ message: "Health tracker deleted successfully" });
});

module.exports = router;
