const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../data/appointments.json");

// Read data from JSON file
function readData() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Write data to JSON file
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Get all appointments
exports.getAllAppointments = () => {
  return readData();
};

// Get appointment by ID
exports.getAppointmentById = (id) => {
  const appointments = readData();
  return appointments.find((a) => a.id === Number(id));
};

// Add new appointment
exports.addNewAppointment = (appointment) => {
  const appointments = readData();
  appointments.push(appointment);
  writeData(appointments);
  return appointment;
};

// Update appointment
exports.updateExistingAppointment = (id, updatedAppointment) => {
  const appointments = readData();
  const index = appointments.findIndex((a) => a.id === Number(id));
  if (index === -1) return null;

  appointments[index] = { ...appointments[index], ...updatedAppointment };
  writeData(appointments);
  return appointments[index];
};

// Delete appointment
exports.deleteAppointment = (id) => {
  const appointments = readData();
  const filtered = appointments.filter((a) => a.id !== Number(id));
  if (filtered.length === appointments.length) return false;

  writeData(filtered);
  return true;
};
