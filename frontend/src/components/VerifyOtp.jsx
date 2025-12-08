// src/components/VerifyOtp.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { setAuth } from "../utils/auth";

export default function VerifyOtp({ onAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (!stateEmail) {
      // if user refreshed or came directly, send back to login
      navigate("/login", { replace: true });
    } else {
      setEmail(stateEmail);
    }
  }, [location.state, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const data = await apiRequest("/users/verify-login", {
        method: "POST",
        body: { email, otp },
      });

      // expect: { token, user, message }
      const { token, user } = data;
      if (!token) throw new Error("Token not returned from server");

      // 🔐 store token + user
      setAuth(token, user);

      if (onAuthenticated) onAuthenticated(token, user);

      setMsg("OTP verified! Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);
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
    heading: { textAlign: "center", marginBottom: "10px" },
    sub: { textAlign: "center", marginBottom: "20px", fontSize: "14px" },
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
      background: "#16a34a",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    },
    error: { color: "red", textAlign: "center", marginTop: "10px" },
    msg: { color: "green", textAlign: "center", marginTop: "10px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Verify OTP</h2>
      <p style={styles.sub}>OTP has been sent to: <strong>{email}</strong></p>

      <form onSubmit={handleVerify}>
        <div style={styles.group}>
          <label style={styles.label}>Enter OTP</label>
          <input
            style={styles.input}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={styles.button}>
          Verify
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}