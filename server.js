
const express = require("express");
const app = express();

//Health Tracker routes
app.get("/health_tracker", (req, res ) => {
    res.send("Track your health goals");
});

app.post("/health_tracker", (req, res) => {
    res.send("Add a new health goal")
});

app.put("/health_tracker/:id", (req, res) => {
    res.send(`Update health goal with ID ${req.params.id}`);
});

app.delete("/health_tracker/:id", (req, res) => {
    res.send(`Delete health goal with ID ${req.params.id}`);
});

//Appointment manager routes
app.get("/appointment_manager", (req, res) => {
    res.send("Book and manage your appointments here.")
});

app.post("/appointments", (req, res) => {
    res.send("Book a new appointment");
});

app.delete("/appointments/:id", (req, res) => {
    res.send(`Cancel appointment with ID ${req.params.id}`);
});

//Login Route
app.get("/login", (req,res) => {
    res.send("Login")
});

//Health records routes
app.get("/health_records", (req, res) => {
    res.send("Records and History")
});

app.get("/health_records/:id", (req, res) => {
    res.send(`Get record with ID ${req.params.id}`);
});

app.post("/health_records", (req, res) => {
    res.send("Add a new health record");
});

//Health metrics routes
app.get("/health_metrics", (req, res) => {
    res.send("Progress Dashboard")
});

//Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Health Portal");
});

app.listen(3000, () => {
    console.log(`Server running `);
});
