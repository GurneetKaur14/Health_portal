const express = require("express");
const app = express();
const PORT = 3000;

const userRoutes = require("./modules/users/routes/userRoutes");
const appointmentRoutes = require("./modules/appointments/routes/appointmentRoutes");
const healthRecordRoutes = require("./modules/healthRecords/routes/healthRecordRoutes");
const healthMetricsRoutes = require("./modules/healthMetrics/routes/healthMetricRoutes");
const healthTrackerRoutes = require("./modules/healthTracker/routes/healthTrackerRoutes");

// App-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/healthRecords", healthRecordRoutes);
app.use("/api/healthMetrics", healthMetricsRoutes);
app.use("/api/healthTracker", healthTrackerRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
