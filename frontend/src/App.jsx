import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [dark, setDark] = useState(false);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API}/notes`, {
      headers: { Authorization: token },
    });
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    const token = localStorage.getItem("token");

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

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(`${API}/notes/${id}`, {
      headers: { Authorization: token },
    });

    fetchNotes();
  };

  return (
    <div
      style={{
        background: dark ? "#121212" : "#f5f5f5",
        color: dark ? "#ffffff" : "#000000",
        minHeight: "100vh",
        padding: "40px",
        transition: "0.3s",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <h1 style={{ textAlign: "center" }}>Notes App</h1>

        <button
          onClick={() => setDark(!dark)}
          style={{
            marginBottom: "20px",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={inputStyle}
          />
          <button onClick={saveNote} style={primaryButton}>
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: dark ? "#1e1e1e" : "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button onClick={() => editNote(note)} style={editButton}>
                    Edit
                  </button>
                  <button onClick={() => deleteNote(note._id)} style={deleteButton}>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const primaryButton = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

const editButton = {
  backgroundColor: "#ffc107",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const deleteButton = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default App;