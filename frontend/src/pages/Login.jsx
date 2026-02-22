import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={page}>
      <div style={glassCard}>
        <h2 style={title}>Welcome Back</h2>

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

        <button onClick={login} style={button}>
          Login
        </button>

        <p style={footerText}>
          No account? <Link to="/register" style={link}>Create one</Link>
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
  padding: "40px 50px"
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

const button = {
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