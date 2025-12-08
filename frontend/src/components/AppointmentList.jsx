import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserRole, getUserId } from "../utils/auth";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Search + Sort + Filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
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

      if (statusFilter) url += `&status=${statusFilter}`;
      if (dateFilter) url += `&date=${dateFilter}`;

      if (role === "doctor") url += `&doctorId=${userId}`;
      if (role === "patient") url += `&patientId=${userId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [search, sortBy, sortOrder, statusFilter, dateFilter, page, limit]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "navy" }}>Welcome to Appointments Portal</h1>

      {/* FILTERS SECTION */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, status, date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        />

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="status">Status</option>
          <option value="patientName">Patient Name</option>
          <option value="doctorName">Doctor Name</option>
        </select>

        {/* Sort Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="asc">Ascending ↑</option>
          <option value="desc">Descending ↓</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: "8px" }}
        />

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSearch("");
            setSortBy("date");
            setSortOrder("asc");
            setStatusFilter("");
            setDateFilter("");
            setPage(1);
          }}
          style={{ padding: "8px", background: "#ddd" }}
        >
          Reset Filters
        </button>
      </div>

      <h2>Appointments List</h2>
      {appointments.length === 0 && <p>No appointments found.</p>}

      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* LIST */}
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {appointments.map((app) => (
          <li
            key={app._id}
            style={{
              marginBottom: "15px",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#e9f3ff",
            }}
          >
            <div>
              <strong>Patient:</strong> {app.patientName}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(app.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {app.status}
              </span>
            </div>

            <div style={{ marginTop: "8px" }}>
              {role === "doctor" && (
                <>
                  <button onClick={() => updateStatus(app._id, "pending")}>
                    Pending
                  </button>
                  <button onClick={() => updateStatus(app._id, "fulfilled")}>
                    Fulfilled
                  </button>
                  <button onClick={() => updateStatus(app._id, "rejected")}>
                    Rejected
                  </button>
                  <button
                    onClick={() => navigate(`/edit/${app._id}`)}
                    style={{
                      marginLeft: "10px",
                      background: "#4caf50",
                      color: "white",
                    }}
                  >
                    Edit
                  </button>
                </>
              )}

              <button
                onClick={() => navigate(`/appointment/${app._id}`)}
                style={{ marginLeft: "10px" }}
              >
                View
              </button>

              {role === "doctor" && (
                <button
                  onClick={() => handleDelete(app._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>

        <strong>Page {page}</strong>

        <button onClick={() => setPage((p) => p + 1)} style={{ marginLeft: "10px" }}>
          Next
        </button>
      </div>
    </div>
  );
}