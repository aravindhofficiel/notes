import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    <div style={authContainer}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={login} style={primaryBtn}>
          Login
        </button>

        <p style={{ marginTop: "15px" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const authContainer = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f4f6f9"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "350px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const primaryBtn = {
  padding: "10px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};