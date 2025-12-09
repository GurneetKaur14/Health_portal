require("dotenv").config();  

const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./shared/middlewares/connect-db");

const PORT = process.env.PORT || 3000;
const hostname = "0.0.0.0";
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB()
  .then(() => {
    console.log("Database Connected");

    // Routes
    const userRoutes = require("./modules/users/routes/userRoutes");
    const appointmentRoutes = require("./modules/appointments/routes/appointmentRoutes");
    const healthRecordRoutes = require("./modules/healthRecords/routes/healthRecordRoutes");
    const healthMetricsRoutes = require("./modules/healthMetrics/routes/healthMetricRoutes");
    const healthTrackerRoutes = require("./modules/healthTracker/routes/healthTrackerRoutes");

    app.use("/api/users", userRoutes);
    app.use("/api/appointments", appointmentRoutes);
    app.use("/api/healthRecords", healthRecordRoutes);
    app.use("/api/healthMetrics", healthMetricsRoutes);
    app.use("/api/healthTracker", healthTrackerRoutes);

    // Error handler
    app.use((err, req, res, next) => {
      console.error("SERVER ERROR:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); 
  });