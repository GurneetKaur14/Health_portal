const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthTracker.json");

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

exports.getAllHealthTrackers = async () => {
  return await readData();
};

exports.getHealthTrackerById = async (id) => {
  const trackers = await readData();
  return trackers.find(t => t.id === Number(id));
};

exports.addNewHealthTracker = async (tracker) => {
  const trackers = await readData();
  trackers.push(tracker);
  await writeData(trackers);
  return tracker;
};

exports.updateExistingHealthTracker = async (id, updatedTracker) => {
  const trackers = await readData();
  const index = trackers.findIndex(t => t.id === Number(id));
  if (index === -1) return null;

  trackers[index] = { ...trackers[index], ...updatedTracker };
  await writeData(trackers);
  return trackers[index];
};

exports.deleteHealthTracker = async (id) => {
  const trackers = await readData();
  const filtered = trackers.filter(t => t.id !== Number(id));
  if (filtered.length === trackers.length) return false;

  await writeData(filtered);
  return true;
};
