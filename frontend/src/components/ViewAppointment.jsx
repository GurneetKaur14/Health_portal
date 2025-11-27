import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ViewAppointment() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:3000/api/appointments";

  useEffect(() => {
    async function loadAppointment() {
      try {
        const res = await fetch(`${BASE_URL}/${id}`);

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.message || "Appointment not found.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAppointment(data);

      } catch (err) {
        console.error(err);
        setError("Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    }

    loadAppointment();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "30px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
    },
    link: {
      display: "inline-block",
      marginBottom: "15px",
      color: "#4CAF50",
      textDecoration: "none",
    },
    field: {
      marginBottom: "10px",
    },
    label: {
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.link}>← Back to Appointments</Link>

      <h2 style={styles.heading}>Appointment Details</h2>

      <p style={styles.field}>
        <span style={styles.label}>Patient Name:</span> {appointment.patientName}
      </p>
      <p style={styles.field}>
        <span style={styles.label}>Doctor:</span> {appointment.doctor}
      </p>
      <p style={styles.field}>
        <span style={styles.label}>Date:</span> {appointment.date?.substring(0, 10)}
      </p>
      <p style={styles.field}>
        <span style={styles.label}>Time:</span> {appointment.time}
      </p>
      <p style={styles.field}>
        <span style={styles.label}>Status:</span> {appointment.status}
      </p>
    </div>
  );
}
