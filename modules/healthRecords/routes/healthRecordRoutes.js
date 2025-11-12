const express = require("express");
const router = express.Router();

const model = require("../models/healthRecordModel");
const { healthRecordValidationRules, validateHealthRecord } = require("../middlewares/healthRecordValidation");

// GET all records
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const sort_by = req.query.sort_by || "date";
    const sort_order = req.query.sort_order === "asc" ? 1 : -1;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Count total matching documents
    const count = await model.countDocuments({
      $or: [
        { diagnosis: { $regex: search, $options: "i" } },
        { prescription: { $regex: search, $options: "i" } },
      ],
    });

    if (count === 0)
      return res.status(200).json({ count: 0, page: 1, data: [] });

    const records = await model.find(
      {
        $or: [
          { diagnosis: { $regex: search, $options: "i" } },
          { prescription: { $regex: search, $options: "i" } },
        ],
      },
      {},
      {
        limit,
        skip: (page - 1) * limit,
        sort: { [sort_by]: sort_order },
      }
    );

    res.status(200).json({ count, page, limit, data: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }  
});

// GET single record by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await model.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Health record not found" });
    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST new record
router.post("/", healthRecordValidationRules, validateHealthRecord, async (req, res) => {
  try {
    const newRecord = await model.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update record
router.put("/:id", healthRecordValidationRules, validateHealthRecord, async (req, res) => {
  try {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updated) return res.status(404).json({ message: "Health record not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE record
router.delete("/:id", async (req, res) => {
  try {
    const success = await model.findByIdAndDelete(req.params.id);
    if (!success) return res.status(404).json({ message: "Health record not found" });
    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
