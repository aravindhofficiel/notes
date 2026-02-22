import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ================= AUTH ================= */

  const register = async () => {
    await axios.post(`${API}/register`, { email, password });
    alert("Registered successfully. Now login.");
    setIsLogin(true);
  };

  const login = async () => {
    const res = await axios.post(`${API}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
  };

  /* ================= NOTES ================= */

  const fetchNotes = async () => {
    const res = await axios.get(`${API}/notes`, {
      headers: { Authorization: token },
    });
    setNotes(res.data);
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const saveNote = async () => {
    if (editingId) {
      await axios.put(
        `${API}/notes/${editingId}`,
        { title, content },
        { headers: { Authorization: token } }
      );
      setEditingId(null);
    } else {
      await axios.post(
        `${API}/notes`,
        { title, content },
        { headers: { Authorization: token } }
      );
    }

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, {
      headers: { Authorization: token },
    });
    fetchNotes();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  /* ================= UI ================= */

  if (!token) {
    return (
      <div style={authContainer}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <input
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

        <button
          onClick={isLogin ? login : register}
          style={primaryButton}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer", marginTop: "10px" }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Notes App</h1>
      <button onClick={logout} style={logoutButton}>
        Logout
      </button>

      <div style={{ marginTop: "20px" }}>
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
        <button onClick={saveNote} style={primaryButton}>
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {notes.map((note) => (
          <div key={note._id} style={card}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            <div>
              <button
                onClick={() => editNote(note)}
                style={editButton}
              >
                Edit
              </button>
              <button
                onClick={() => deleteNote(note._id)}
                style={deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const authContainer = {
  maxWidth: "400px",
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const input = {
  padding: "10px",
  fontSize: "16px",
  marginBottom: "10px",
};

const primaryButton = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const logoutButton = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
};

const card = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  marginBottom: "15px",
};

const editButton = {
  backgroundColor: "#ffc107",
  border: "none",
  padding: "5px 10px",
  marginRight: "10px",
  cursor: "pointer",
};

const deleteButton = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
};

export default App;