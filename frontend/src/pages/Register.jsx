import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await axios.post(`${API}/register`, { email, password });
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={authContainer}>
      <div style={card}>
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

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

        <button onClick={register} style={primaryBtn}>
          Register
        </button>

        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/">Login</Link>
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
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};