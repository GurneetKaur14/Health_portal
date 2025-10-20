const express = require("express");
const router = express.Router();

const model = require("../models/healthMetricModel");
const { healthMetricValidationRules, validateHealthMetric } = require("../middlewares/healthMetricValidation");

// GET all metrics
router.get("/", async (req, res) => {
  try {
    const metrics = await model.getAllHealthMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET single metric by ID
router.get("/:id", async (req, res) => {
  try {
    const metric = await model.getHealthMetricById(req.params.id);
    if (!metric) return res.status(404).json({ message: "Health metric not found" });
    res.status(200).json(metric);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST new metric
router.post("/", healthMetricValidationRules, validateHealthMetric, async (req, res) => {
  try {
    const newMetric = await model.addNewHealthMetric(req.body);
    res.status(201).json(newMetric);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update metric
router.put("/:id", healthMetricValidationRules, validateHealthMetric, async (req, res) => {
  try {
    const updated = await model.updateExistingHealthMetric(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Health metric not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE metric
router.delete("/:id", async (req, res) => {
  try {
    const success = await model.deleteHealthMetric(req.params.id);
    if (!success) return res.status(404).json({ message: "Health metric not found" });
    res.status(200).json({ message: "Health metric deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
