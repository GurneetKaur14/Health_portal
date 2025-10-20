const express = require("express");
const router = express.Router();

const model = require("../models/healthMetricModel");
const { healthMetricValidationRules, validateHealthMetric } = require("../middlewares/healthMetricValidation");

// GET all metrics
router.get("/", (req, res) => {
  const metrics = model.getAllHealthMetrics();
  res.status(200).json(metrics);
});

// GET single metric by ID
router.get("/:id", (req, res) => {
  const metric = model.getHealthMetricById(req.params.id);
  if (!metric) return res.status(404).json({ message: "Health metric not found" });
  res.status(200).json(metric);
});

// POST new metric
router.post("/", healthMetricValidationRules, validateHealthMetric, (req, res) => {
  const newMetric = model.addNewHealthMetric(req.body);
  res.status(201).json(newMetric);
});

// PUT update metric
router.put("/:id", healthMetricValidationRules, validateHealthMetric, (req, res) => {
  const updated = model.updateExistingHealthMetric(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Health metric not found" });
  res.status(200).json(updated);
});

// DELETE metric
router.delete("/:id", (req, res) => {
  const success = model.deleteHealthMetric(req.params.id);
  if (!success) return res.status(404).json({ message: "Health metric not found" });
  res.status(200).json({ message: "Health metric deleted successfully" });
});

module.exports = router;
