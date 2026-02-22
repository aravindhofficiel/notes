import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= TOKEN CHECK ================= */

  const checkExpiry = () => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
      }
    } catch {
      logout();
    }
  };

  /* ================= NOTES ================= */

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, {
        headers: { Authorization: token }
      });
      setNotes(res.data);
    } catch (error) {
      console.log(error);
      logout();
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      await axios.post(
        `${API}/notes`,
        { title, content },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.log(error);
      logout();
    }
  };

  /* ================= LIFECYCLE ================= */

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    checkExpiry();
    fetchNotes();
  }, [token]);

  /* ================= UI ================= */

  return (
    <div style={dashboard}>
      <div style={topBar}>
        <h2>Dashboard</h2>
        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </div>

      <div style={form}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={input}
        />

        <button onClick={addNote} style={primaryButton}>
          Add Note
        </button>
      </div>

      <div style={grid}>
        {notes.map(note => (
          <div key={note._id} style={card}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const dashboard = {
  padding: "40px",
  maxWidth: "1000px",
  margin: "auto",
  fontFamily: "Arial, sans-serif"
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "30px"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "30px"
};

const input = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const primaryButton = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

const logoutButton = {
  padding: "6px 12px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px"
};

const card = {
  padding: "20px",
  borderRadius: "10px",
  background: "#ffffff",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};