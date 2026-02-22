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
  <div style={page}>
    <div style={container}>
      
      <div style={header}>
        <h2 style={titleStyle}>Your Notes</h2>
        <button onClick={logout} style={logoutButton}>
          Logout
        </button>
      </div>

      <div style={cardForm}>
        <input
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textarea}
        />

        <button onClick={addNote} style={primaryButton}>
          Add Note
        </button>
      </div>

      <div style={grid}>
        {notes.map((note) => (
          <div key={note._id} style={noteCard}>
            <h3 style={{ marginBottom: "8px" }}>{note.title}</h3>
            <p style={{ opacity: 0.8 }}>{note.content}</p>
          </div>
        ))}
      </div>

    </div>
  </div>
);
}

/* ================= STYLES ================= */
const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  padding: "40px 20px"
};

const container = {
  maxWidth: "1000px",
  margin: "auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#1e293b"
};

const cardForm = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "30px"
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px"
};

const textarea = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  minHeight: "90px"
};

const primaryButton = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  fontWeight: "500",
  cursor: "pointer"
};

const logoutButton = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#ef4444",
  color: "white",
  cursor: "pointer"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px"
};

const noteCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  color: "#1e293b"
};