const express = require("express");
const router = express.Router();

const model = require("../models/healthTrackerModel");
const { healthTrackerValidationRules, validateHealthTracker } = require("../middlewares/healthTrackerValidation");

// GET all trackers
router.get("/", async (req, res) => {
  try {
    const trackers = await model.getAllHealthTrackers();
    res.status(200).json(trackers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET tracker by ID
router.get("/:id", async (req, res) => {
  try {
    const tracker = await model.getHealthTrackerById(req.params.id);
    if (!tracker) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json(tracker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST new tracker
router.post("/", healthTrackerValidationRules, validateHealthTracker, async (req, res) => {
  try {
    const newTracker = await model.addNewHealthTracker(req.body);
    res.status(201).json(newTracker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update tracker
router.put("/:id", healthTrackerValidationRules, validateHealthTracker, async (req, res) => {
  try {
    const updated = await model.updateExistingHealthTracker(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE tracker
router.delete("/:id", async (req, res) => {
  try {
    const success = await model.deleteHealthTracker(req.params.id);
    if (!success) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json({ message: "Health tracker deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
