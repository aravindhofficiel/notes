import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    await axios.post(`${API}/register`, { email, password });
    window.location.href = "/";
  };

  return (
    <div style={page}>
      <div style={glassCard}>
        <h2 style={title}>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={buttonStyle}>
          Register
        </button>

        <p style={footerText}>
          Already have an account? <Link to="/" style={link}>Login</Link>
        </p>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const page = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  margin: 0
};
const glassCard = {
  width: "90%",
  
  maxWidth: "420px",
  padding: "40px 25px",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  background: "rgba(255,255,255,0.15)",
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  color: "white"
};

const title = {
  textAlign: "center",
  marginBottom: "10px",
  fontWeight: "600"
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  fontSize: "14px"
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#ffffff",
  color: "#4f46e5",
  fontWeight: "600",
  cursor: "pointer"
};

const footerText = {
  textAlign: "center",
  fontSize: "14px"
};

const link = {
  color: "#fff",
  fontWeight: "600"
};