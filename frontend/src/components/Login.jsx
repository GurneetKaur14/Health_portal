// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      await apiRequest("/users/login", {
        method: "POST",
        body: {
          email: identifier, 
          password,
        },
      });

      setMsg("OTP sent. Please check your email / phone.");
      // 👉 redirect to OTP screen with identifier
      navigate("/verify-otp", { state: { email: identifier } });
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "60px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
    },
    heading: { textAlign: "center", marginBottom: "20px" },
    group: { marginBottom: "15px", display: "flex", flexDirection: "column" },
    label: { fontWeight: "bold", marginBottom: "5px" },
    input: {
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      background: "#2563eb",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "5px",
    },
    link: {
      color: "blue",
      cursor: "pointer",
      textDecoration: "underline",
      textAlign: "center",
      marginTop: "15px",
      fontSize: "14px",
    },
    error: { color: "red", textAlign: "center", marginTop: "10px" },
    msg: { color: "green", textAlign: "center", marginTop: "10px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.group}>
          <label style={styles.label}>Email / Username</label>
          <input
            style={styles.input}
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Send OTP
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {msg && <p style={styles.msg}>{msg}</p>}

      <p
        style={styles.link}
        onClick={() => navigate("/register")}
      >
        Don't have an account? Register here
      </p>
    </div>
  );
}
