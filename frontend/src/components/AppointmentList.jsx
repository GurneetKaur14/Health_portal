import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3000/api/appointments";

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
     `${BASE_URL}?search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&limit=${limit}`
);

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await res.json();
      setAppointments(data.data || []); 
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete appointment?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
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
      <h1 style={{color: "navy"}}>Welcome to the Appointments Portal</h1>
      
     <p>
    Make a new appointment
    <button 
      onClick={() => navigate("/book")}
      style={{
        padding: "5px 10px",
        marginLeft: "10px",
        backgroundColor: "navy",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Book Now
    </button>
  </p>
    
      <p>View upcoming appointments:</p>
       
    <div style={{ marginBottom: "15px" }}>
      <label><strong>Sort By:</strong> </label>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="date">Date</option>
      <option value="patientName">Patient Name</option>
      <option value="doctor">Doctor</option>
      <option value="status">Status</option>
  </select>

    <label style={{ marginLeft: "15px" }}><strong>Order:</strong> </label>
    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
   </div>

    <div style={{ marginBottom: "15px" }}>
      <input
        type="text"
        placeholder="Search appointment by patient name"
        value={search}
        onChange={(e) => {
        setSearch(e.target.value);
        setPage(1); 
      }}
        style={{ padding: "5px", width: "300px" }}
      />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label>Show: </label>
      <select
        value={limit}
        onChange={(e) => {
        setLimit(e.target.value);
        setPage(1);
      }}
      >
      <option value="5">5 per page</option>
      <option value="10">10 per page</option>
      <option value="20">20 per page</option>
    </select>
    </div>

    {loading && <p style={{ color: "gray" }}>Loading...</p>}

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
              <strong>Appointment Date:</strong> {new Date(app.date).toLocaleDateString()}
            </div>

            <div>
              <button
                onClick={() => navigate(`/appointment/${app._id}`)}
                style={{ marginRight: "10px" }}
              >
                View Details
              </button>

              <button
                onClick={() => navigate(`/edit/${app._id}`)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(app._id)}>Delete</button>
            </div>
          </li>
          ))}
      </ul>

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
