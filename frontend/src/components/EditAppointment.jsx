import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditAppointment() {
  const { id } = useParams();
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

  const BASE_URL = "http://localhost:3000/api/appointments";

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to load appointment");

        const data = await res.json();

        setForm({
          id: data.id || Date.now(),
          patientName: data.patientName,
          doctor: data.doctor,
          date: data.date ? data.date.split("T")[0] : "",
          time: data.time,
          status: data.status,
        });

      } catch (err) {
        console.error(err);
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

    if (!form.patientName || !form.doctor || !form.date || !form.time) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update appointment");
      }

      setSuccess("Appointment updated successfully!");
      setTimeout(() => navigate("/"), 1200);

    } catch (err) {
      console.error(err);
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
        <input type="hidden" name="id" value={form.id} />

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
          <label style={styles.label}>Doctor:</label>
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
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="rejected">rejected</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
}
