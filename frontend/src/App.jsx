// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOtp from "./components/VerifyOtp";
import AppointmentList from "./components/AppointmentList";
import BookAppointment from "./components/BookAppointment";
import EditAppointment from "./components/EditAppointment";
import ViewAppointment from "./components/ViewAppointment";

import { isAuthenticated, clearAuth, getUser } from "./utils/auth";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  const handleAuthenticated = (_token, userObj) => {
    setAuthed(true);
    setUser(userObj || getUser());
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    setUser(null);
  };

  useEffect(() => {
    setAuthed(isAuthenticated());
    setUser(getUser());
  }, []);

  return (
    <Router>
      <nav
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Link to="/">Appointments</Link>
        {authed && <Link to="/book">Book</Link>}

        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
          {user && <span style={{ fontSize: "14px" }}>Hi, {user.name || user.email}</span>}
          {!authed ? (
            <Link to="/login">Login</Link>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp onAuthenticated={handleAuthenticated} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppointmentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment/:id"
          element={
            <ProtectedRoute>
              <ViewAppointment />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;