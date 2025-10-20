const express = require("express");
const router = express.Router();

const model = require("../models/healthRecordModel");
const { healthRecordValidationRules, validateHealthRecord } = require("../middlewares/healthRecordValidation");

// GET all records
router.get("/", async (req, res) => {
  try {
    const records = await model.getAllHealthRecords();
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET single record by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await model.getHealthRecordById(req.params.id);
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
    const newRecord = await model.addNewHealthRecord(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT update record
router.put("/:id", healthRecordValidationRules, validateHealthRecord, async (req, res) => {
  try {
    const updated = await model.updateExistingHealthRecord(req.params.id, req.body);
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
    const success = await model.deleteHealthRecord(req.params.id);
    if (!success) return res.status(404).json({ message: "Health record not found" });
    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
