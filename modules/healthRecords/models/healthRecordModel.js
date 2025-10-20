const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthRecords.json");

// Read JSON file
async function readData() {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Write JSON file
async function writeData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// CRUD operations

exports.getAllHealthRecords = async () => {
  return await readData();
};

exports.getHealthRecordById = async (id) => {
  const records = await readData();
  return records.find(r => r.id === Number(id));
};

exports.addNewHealthRecord = async (record) => {
  const records = await readData();
  records.push(record);
  await writeData(records);
  return record;
};

exports.updateExistingHealthRecord = async (id, updatedRecord) => {
  const records = await readData();
  const index = records.findIndex(r => r.id === Number(id));
  if (index === -1) return null;

  records[index] = { ...records[index], ...updatedRecord };
  await writeData(records);
  return records[index];
};

exports.deleteHealthRecord = async (id) => {
  const records = await readData();
  const filtered = records.filter(r => r.id !== Number(id));
  if (filtered.length === records.length) return false;

  await writeData(filtered);
  return true;
};
