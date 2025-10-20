const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../data/users.json");

function readData() {
    const data = fs.readFileSync(filePath, "utf8");
     return JSON.parse(data)
};

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

//Get all the users

exports.getAllUsers = () => {
    return readData(); 
}

//Get user by ID
exports.getUserById = (id) => {
    const users = readData();
    return users.find((u) => u.id === Number(id));
};

//Add new user
exports.addNewUser = (user) => {
    const users = readData();
    users.push(user);
    writeData(users);
    return user;
}

//Update existing user
exports.updateExistingUser = (id, updatedUser) => {
    const users = readData();
    const index = users.findIndex((u) => u.id === Number(id));
  if (index === -1) return null;

  users[index] = { ...users[index], ...updatedUser };
  writeData(users);
  return users[index];
};

//// Delete user
exports.deleteUser = (id) => {
  const users = readData();
  const filtered = users.filter((u) => u.id !== Number(id));
  if (filtered.length === users.length) return false;

  writeData(filtered);
  return true;
};
