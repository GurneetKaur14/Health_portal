const fs = require("fs").promises; // use fs.promises for async
const path = require("path");

const filePath = path.join(__dirname, "../../../data/appointments.json");

// Read data from JSON file (async)
async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data:", err);
    throw new Error("Failed to read appointments data");
  }
}

// Write data to JSON file (async)
async function writeData(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data:", err);
    throw new Error("Failed to write appointments data");
  }
}

// Get all appointments
exports.getAllAppointments = async () => {
  return await readData();
};

// Get appointment by ID
exports.getAppointmentById = async (id) => {
  const appointments = await readData();
  return appointments.find((a) => a.id === Number(id));
};

// Add new appointment
exports.addNewAppointment = async (appointment) => {
  const appointments = await readData();
  appointments.push(appointment);
  await writeData(appointments);
  return appointment;
};

// Update appointment
exports.updateExistingAppointment = async (id, updatedAppointment) => {
  const appointments = await readData();
  const index = appointments.findIndex((a) => a.id === Number(id));
  if (index === -1) return null;

  appointments[index] = { ...appointments[index], ...updatedAppointment };
  await writeData(appointments);
  return appointments[index];
};

// Delete appointment
exports.deleteAppointment = async (id) => {
  const appointments = await readData();
  const filtered = appointments.filter((a) => a.id !== Number(id));
  if (filtered.length === appointments.length) return false;

  await writeData(filtered);
  return true;
};
