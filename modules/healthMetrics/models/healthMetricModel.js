const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../../../data/healthMetrics.json");

// Read JSON file asynchronously
async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error("Error reading health metrics data");
  }
}

// Write JSON file asynchronously
async function writeData(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error("Error writing health metrics data");
  }
}

// Get all metrics
exports.getAllHealthMetrics = async () => {
  try {
    return await readData();
  } catch (err) {
    throw err;
  }
};

// Get metric by ID
exports.getHealthMetricById = async (id) => {
  try {
    const metrics = await readData();
    return metrics.find((m) => m.id === Number(id));
  } catch (err) {
    throw err;
  }
};

// Add new metric
exports.addNewHealthMetric = async (metric) => {
  try {
    const metrics = await readData();
    metrics.push(metric);
    await writeData(metrics);
    return metric;
  } catch (err) {
    throw err;
  }
};

// Update metric
exports.updateExistingHealthMetric = async (id, updatedMetric) => {
  try {
    const metrics = await readData();
    const index = metrics.findIndex((m) => m.id === Number(id));
    if (index === -1) return null;

    metrics[index] = { ...metrics[index], ...updatedMetric };
    await writeData(metrics);
    return metrics[index];
  } catch (err) {
    throw err;
  }
};

// Delete metric
exports.deleteHealthMetric = async (id) => {
  try {
    const metrics = await readData();
    const filtered = metrics.filter((m) => m.id !== Number(id));
    if (filtered.length === metrics.length) return false;

    await writeData(filtered);
    return true;
  } catch (err) {
    throw err;
  }
};
