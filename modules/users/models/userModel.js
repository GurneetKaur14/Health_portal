const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../../../data/users.json");

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

exports.getAllUsers = async () => {
  return await readData();
};

exports.getUserById = async (id) => {
  const users = await readData();
  return users.find(u => u.id === Number(id));
};

exports.addNewUser = async (user) => {
  const users = await readData();
  users.push(user);
  await writeData(users);
  return user;
};

exports.updateExistingUser = async (id, updatedUser) => {
  const users = await readData();
  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) return null;

  users[index] = { ...users[index], ...updatedUser };
  await writeData(users);
  return users[index];
};

exports.deleteUser = async (id) => {
  const users = await readData();
  const filtered = users.filter(u => u.id !== Number(id));
  if (filtered.length === users.length) return false;

  await writeData(filtered);
  return true;
};
