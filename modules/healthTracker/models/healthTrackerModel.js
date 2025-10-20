const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthTracker.json");

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

// Get all trackers
exports.getAllHealthTrackers = () => {
  return readData();
};

// Get tracker by ID
exports.getHealthTrackerById = (id) => {
  const trackers = readData();
  return trackers.find(t => t.id ===  Number(id));
};

// Add new tracker
exports.addNewHealthTracker = (tracker) => {
  const trackers = readData();
  trackers.push(tracker);
  writeData(trackers);
  return tracker;
};

// Update tracker
exports.updateExistingHealthTracker = (id, updatedTracker) => {
  const trackers = readData();
  const index = trackers.findIndex(t => t.id ===  Number(id));
  if (index === -1) return null;

  trackers[index] = { ...trackers[index], ...updatedTracker };
  writeData(trackers);
  return trackers[index];
};

// Delete tracker
exports.deleteHealthTracker = (id) => {
  const trackers = readData();
  const filtered = trackers.filter(t => t.id !==  Number(id));
  if (filtered.length === trackers.length) return false;

  writeData(filtered);
  return true;
};
