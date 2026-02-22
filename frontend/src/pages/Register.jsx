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

    await axios.post(`${API}/register`, { email, password });
    navigate("/");
  };

  return (
    <div style={authContainer}>
      <h2>Register</h2>

      <input placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={input} />

      <input type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={input} />

      <button onClick={register} style={primaryBtn}>
        Register
      </button>

      <Link to="/">Back to login</Link>
    </div>
  );
}