const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthMetrics.json");

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

// Get all metrics
exports.getAllHealthMetrics = () => {
  return readData();
};

// Get metric by ID
exports.getHealthMetricById = (id) => {
  const metrics = readData();
  return metrics.find(m => m.id ===  Number(id));
};

// Add new metric
exports.addNewHealthMetric = (metric) => {
  const metrics = readData();
  metrics.push(metric);
  writeData(metrics);
  return metric;
};

// Update metric
exports.updateExistingHealthMetric = (id, updatedMetric) => {
  const metrics = readData();
  const index = metrics.findIndex(m => m.id ===  Number(id));
  if (index === -1) return null;

  metrics[index] = { ...metrics[index], ...updatedMetric };
  writeData(metrics);
  return metrics[index];
};

// Delete metric
exports.deleteHealthMetric = (id) => {
  const metrics = readData();
  const filtered = metrics.filter(m => m.id !==  Number(id));
  if (filtered.length === metrics.length) return false;

  writeData(filtered);
  return true;
};
