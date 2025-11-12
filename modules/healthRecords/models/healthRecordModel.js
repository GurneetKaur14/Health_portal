const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema({
  patientId: { type: Number, required: true },
  doctorId: { type: Number, required: true },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  date: { type: Date, required: true },
});


const HealthRecord = mongoose.model("HealthRecord", HealthRecordSchema);

module.exports = HealthRecord;