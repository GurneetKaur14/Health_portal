
const express = require("express");
const router = express.Router();
const HealthTracker = require("../models/healthTrackerModel");

const { healthTrackerValidationRules, validateHealthTracker } = require("../middlewares/healthTrackerValidation");

//Get all health trackers (with search, sort, pagination)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "createdAt";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await HealthTracker.countDocuments({
      goal: { $regex: search, $options: "i" },
    });

    if (count === 0) {
      return res.status(200).json({ count: 0, page: 1, data: [] });
    }

    const trackers = await HealthTracker.find(
      { goal: { $regex: search, $options: "i" } },
      {},
      {
        limit,
        skip: (page - 1) * limit,
        sort: { [sort_by]: sort_order },
      }
    );

    res.status(200).json({ count, page, limit, data: trackers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get by ID
router.get("/:id", async (req, res) => {
  try {
    const tracker = await HealthTracker.findById(req.params.id);
    if (!tracker) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json(tracker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Post by ID
router.post("/", healthTrackerValidationRules, validateHealthTracker, async (req, res) => {
  try {
    const newTracker = await HealthTracker.create(req.body);
    res.status(201).json(newTracker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create Health Tracker" });
  }
});

// PUT update tracker
router.put("/:id", healthTrackerValidationRules, validateHealthTracker, async (req, res) => {
  try {
    const updated = await HealthTracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update Health Tracker" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await HealthTracker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Health tracker not found" });
    res.status(200).json({ message: "Health tracker deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete Health Tracker" });
  }
});

module.exports = router;
