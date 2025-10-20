const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthRecords.json");

// Read JSON file
function readData() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Write JSON file
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// CRUD operations

// Get all health records
exports.getAllHealthRecords = () => {
  return readData();
};

// Get a health record by ID
exports.getHealthRecordById = (id) => {
  const records = readData();
  return records.find(r => r.id === Number(id));
};

// Add a new health record
exports.addNewHealthRecord = (record) => {
  const records = readData();
  records.push(record);
  writeData(records);
  return record;
};

// Update a health record
exports.updateExistingHealthRecord = (id, updatedRecord) => {
  const records = readData();
  const index = records.findIndex(r => r.id === Number(id));
  if (index === -1) return null;

  records[index] = { ...records[index], ...updatedRecord };
  writeData(records);
  return records[index];
};

// Delete a health record
exports.deleteHealthRecord = (id) => {
  const records = readData();
  const filtered = records.filter(r => r.id !== Number(id));
  if (filtered.length === records.length) return false;

  writeData(filtered);
  return true;
};
