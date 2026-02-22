import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    const res = await axios.get(`${API}/notes`);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const saveNote = async () => {
    if (editingId) {
      await axios.put(`${API}/notes/${editingId}`, { title, content });
      setEditingId(null);
    } else {
      await axios.post(`${API}/notes`, { title, content });
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
    await axios.delete(`${API}/notes/${id}`);
    fetchNotes();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Notes App</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={styles.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button style={styles.primaryBtn} onClick={saveNote}>
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <div style={styles.notesGrid}>
        {notes.map((note) => (
          <div key={note._id} style={styles.card}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => editNote(note)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteNote(note._id)}
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

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    minHeight: "80px",
  },
  primaryBtn: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  editBtn: {
    backgroundColor: "#ffc107",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default App;