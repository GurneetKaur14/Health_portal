const express = require("express");
const router = express.Router();

const model = require("../models/healthRecordModel");
const { healthRecordValidationRules, validateHealthRecord } = require("../middlewares/healthRecordValidation");

// GET all records
router.get("/", (req, res) => {
  const records = model.getAllHealthRecords();
  res.status(200).json(records);
});

// GET single record by ID
router.get("/:id", (req, res) => {
  const record = model.getHealthRecordById(req.params.id);
  if (!record) return res.status(404).json({ message: "Health record not found" });
  res.status(200).json(record);
});

// POST new record
router.post("/", healthRecordValidationRules, validateHealthRecord, (req, res) => {
  const newRecord = model.addNewHealthRecord(req.body);
  res.status(201).json(newRecord);
});

// PUT update record
router.put("/:id", healthRecordValidationRules, validateHealthRecord, (req, res) => {
  const updated = model.updateExistingHealthRecord(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Health record not found" });
  res.status(200).json(updated);
});

// DELETE record
router.delete("/:id", (req, res) => {
  const success = model.deleteHealthRecord(req.params.id);
  if (!success) return res.status(404).json({ message: "Health record not found" });
  res.status(200).json({ message: "Health record deleted successfully" });
});

module.exports = router;
