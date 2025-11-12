const express = require("express");
const router = express.Router();

const model = require("../models/healthMetricModel");
const { healthMetricValidationRules, validateHealthMetric } = require("../middlewares/healthMetricValidation");

// GET all metrics
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "date";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Build search filter
    let filter = {
      $or: [
        { bloodPressure: { $regex: search, $options: "i" } }, // string field
      ],
    };

    // If search is numeric, also filter heartRate
    if (!isNaN(search)) {
      filter.$or.push({ heartRate: Number(search) });
    }

    // Count total documents
    const count = await model.countDocuments(filter);

    if (count === 0) {
      return res.status(200).json({ count: 0, page: 1, data: [] });
    }

    // Fetch paginated and sorted data
    const metrics = await model.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sort_by]: sort_order });

    res.status(200).json({ count, page, limit, data: metrics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET single metric by ID
router.get("/:id", async (req, res) => {
  try {
    const metric = await model.findById(req.params.id);
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
    const newMetric = await model.create(req.body);
    res.status(201).json(newMetric);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update metric
router.put("/:id", healthMetricValidationRules, validateHealthMetric, async (req, res) => {
  try {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body);
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
    const success = await model.findByIdAndDelete(req.params.id);
    if (!success) return res.status(404).json({ message: "Health metric not found" });
    res.status(200).json({ message: "Health metric deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
