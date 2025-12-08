import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserRole, getUserId } from "../utils/auth";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3000/api/appointments";

  const role = getUserRole();
  const userId = getUserId();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = getToken();
      let url = `${BASE_URL}?search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&limit=${limit}`;

      if (role === "doctor") {
        url += `&doctorId=${userId}`;
      }
      if (role === "patient") {
        url += `&patientId=${userId}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();
      setAppointments(data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      fetchAppointments();
    } catch {
      alert("Unable to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Unable to delete");
      }
      fetchAppointments();
      setSuccess("Appointment deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Unable to delete appointment.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [sortBy, sortOrder, search, page, limit]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "navy" }}>Welcome to the Appointments Portal</h1>

      {/* PATIENT & DOCTOR VIEW */}
      <h2>Appointments List</h2>
      {appointments.length === 0 && <p>No appointments found.</p>}
      {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {appointments.map((app) => (
          <li
            key={app._id}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ddddddff",
              borderRadius: "8px",
              backgroundColor: "#b7cbfaff",
            }}
          >
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>
              <strong>Patient:</strong> {app.patientName}
            </div>
            <div style={{ fontSize: "14px", marginBottom: "5px" }}>
              <strong>Date:</strong> {new Date(app.date).toLocaleDateString()}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Status:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>{app.status}</span>
            </div>

            {/* STATUS & VIEW BUTTONS */}
            <div>
              {role === "doctor" && (
                <>
                  <button
                    onClick={() => updateStatus(app._id, "pending")}
                    style={{ marginRight: "10px" }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "fulfilled")}
                    style={{ marginRight: "10px" }}
                  >
                    Fulfilled
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    style={{ marginRight: "10px" }}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => handleDelete(app._id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => navigate(`/appointment/${app._id}`)}
                style={{ marginLeft: "15px" }}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
