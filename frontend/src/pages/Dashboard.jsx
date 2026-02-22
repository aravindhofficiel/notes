import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  /* ================= FETCH NOTES ================= */

  const fetchNotes = async (currentToken) => {
    try {
      const res = await axios.get(`${API}/notes`, {
        headers: { Authorization: currentToken }
      });
      setNotes(res.data);
    } catch {
      logout();
    }
  };

  /* ================= ADD NOTE ================= */

  const addNote = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) return logout();

    if (!title.trim() || !content.trim()) return;

    try {
      await axios.post(
        `${API}/notes`,
        { title, content },
        { headers: { Authorization: currentToken } }
      );

      setTitle("");
      setContent("");
      fetchNotes(currentToken);
    } catch {
      logout();
    }
  };

  /* ================= LIFECYCLE ================= */

  useEffect(() => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      window.location.replace("/");
      return;
    }

    try {
      const decoded = jwtDecode(currentToken);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      fetchNotes(currentToken);
    } catch {
      logout();
    }
  }, []);

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
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={input}
        />

        <button onClick={addNote} style={primaryButton}>
          Add Note
        </button>
      </div>

      <div style={grid}>
        {notes.map((note) => (
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
  backgroundColor: "#2563eb",
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
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  color: "#111827"
};