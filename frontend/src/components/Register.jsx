// src/components/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      
      console.log("Backend Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f7f7f7",
    },

    container: {
      width: "100%",
      maxWidth: "400px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      background: "white",
      fontFamily: "Arial, sans-serif",
    },

    heading: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
    },

    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },

    select: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },

    button: {
      width: "100%",
      padding: "12px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
      fontWeight: "bold",
    },

    error: {
      color: "red",
      textAlign: "center",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Register</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
