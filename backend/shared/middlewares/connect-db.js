const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

async function connectDB() {
  try {
    await mongoose.connect(DB_URL, { dbName: "ProjectHealthPortal" });
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
    process.exit(1); 
  }
}

module.exports = connectDB;
