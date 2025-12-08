import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken, getUserRole } from "../utils/auth";

export default function EditAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = getUserRole();

  // FIX: added doctorId and patientId
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    status: "pending",
    doctorId: "",
    patientId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE_URL = "http://localhost:3000/api/appointments";

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = getToken();

        const res = await fetch(`${BASE_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load appointment");

        const data = await res.json();

        // FIX: include doctorId + patientId
        setForm({
          patientName: data.patientName,
          doctorName: data.doctorName,
          date: data.date?.split("T")[0] || "",
          time: data.time,
          status: data.status,
          doctorId: data.doctorId,
          patientId: data.patientId,
        });
      } catch (err) {
        console.error("Load error:", err);
        setError(err.message);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = getToken();

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form), // FIX: sends doctorId + patientId now
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }

      setSuccess("Appointment updated successfully!");
      setTimeout(() => navigate("/appointments"), 1200);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  const styles = {
    container: {
      width: "600px",
      margin: "30px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
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
      marginTop: "10px",
    },
    error: { color: "red", textAlign: "center", marginBottom: "10px" },
    success: { color: "green", textAlign: "center", marginBottom: "10px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Appointment</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Patient Name:</label>
          <input
            style={styles.input}
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            disabled
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Doctor Name:</label>
          <input
            style={styles.input}
            type="text"
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            disabled
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
            value={form.time}
            onChange={handleChange}
          />
        </div>

        {role !== "patient" && (
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
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
}
