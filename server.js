
const express = require("express");
const app = express();

app.get("/health_tracker", (req, res ) => {
    res.send("Set and track your health goals");
});

app.get("/appointment_manager", (req, res) => {
    res.send("Book and manage your appointments here.")
});

app.get("/login", (req,res, next) => {
    res.send("Login")
});

app.get("/health_records", (req, res, next) => {
    res.send("Records and History")
});

app.get("/health_metrics", (req, res, next) => {
    res.send("Progress Dashboard")
});

app.get("/", (req, res) => {
    res.send("Welcome to the Health Portal 🚀");
});

app.listen(3000, () => {
    console.log(`Server running `);
});
