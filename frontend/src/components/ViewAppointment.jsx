import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getToken } from "../utils/auth";

export default function ViewAppointment() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppointment() {
      try {
        const token = getToken();
        if (!token) {
          setError("You must be logged in");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3000/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data?.message || "Appointment not found.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAppointment(data); // single object, NOT data.data
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

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "15px", color: "#4CAF50", textDecoration: "none" }}>← Back to Appointments</Link>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Appointment Details</h2>

      <p><strong>Patient Name:</strong> {appointment.patientName}</p>
      <p><strong>Doctor:</strong> {appointment.doctorName}</p>
      <p><strong>Date:</strong> {appointment.date?.substring(0, 10)}</p>
      <p><strong>Time:</strong> {appointment.time}</p>
      <p><strong>Status:</strong> {appointment.status}</p>
    </div>
  );
}
