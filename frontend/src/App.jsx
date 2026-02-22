import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get(`${API}/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  const addNote = async () => {
    const res = await axios.post(`${API}/notes`, { title, content });
    setNotes([...notes, res.data]);
    setTitle("");
    setContent("");
  };
  const deleteNote = async (id) => {
  await axios.delete(`${API}/notes/${id}`);
  fetchNotes();
};

  return (
    <div style={{ padding: "30px" }}>
      <h1>Notes App</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <br />
      <button onClick={addNote}>Add Note</button>

      <hr />

     {notes.map(note => (
  <div key={note._id} style={{ marginBottom: "20px" }}>
    <h3>{note.title}</h3>
    <p>{note.content}</p>
    <button onClick={() => deleteNote(note._id)}>
      Delete
    </button>
  </div>
))}
    </div>
  );
}

export default App;