import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    patientName: "",
    doctor: "",
    date: "",
    time: "",
    status: "pending",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.patientName || !form.doctor || !form.date || !form.time) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && data.errors.length > 0) {
          setError(data.errors[0].msg);
        } else {
          setError("Failed to create appointment");
        }
        return;
      }

      setSuccess("Appointment booked successfully!");
      setForm({
        id: "",
        patientName: "",
        doctor: "",
        date: "",
        time: "",
        status: "pending",
      });

      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      console.error("Network Error:", err);
      setError("Server not reachable");
    }
  };

  const styles = {
    container: {
      width: "600px",
      margin: "30px 40px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
    },
    heading: { textAlign: "center", marginBottom: "20px" },
    formGroup: { marginBottom: "15px", display: "flex", flexDirection: "column" },
    label: { marginBottom: "5px", fontWeight: "bold" },
    input: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    select: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      padding: "10px",
      width: "100%",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
    },
    error: { color: "red", textAlign: "center", marginBottom: "10px" },
    success: { color: "green", textAlign: "center", marginBottom: "10px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Book Appointment</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>ID:</label>
          <input
            style={styles.input}
            type="number"
            name="id"
            value={form.id}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Patient Name:</label>
          <input
            style={styles.input}
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Doctor Name:</label>
          <input
            style={styles.input}
            type="text"
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Date:</label>
          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Time:</label>
          <input
            style={styles.input}
            type="text"
            name="time"
            placeholder="HH:MM AM/PM"
            value={form.time}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Status:</label>
          <select
            style={styles.select}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Book Appointment</button>
      </form>
    </div>
  );
}
