import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post(`${API}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div style={authContainer}>
      <h2>Login</h2>

      <input placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} style={input} />

      <input type="password" placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)} style={input} />

      <button onClick={login} style={primaryBtn}>Login</button>

      <Link to="/register">Create account</Link>
    </div>
  );
}