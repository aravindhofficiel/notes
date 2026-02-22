// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// const noteSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   userId: String,
// });

// const Note = mongoose.model("Note", noteSchema);

// app.get("/notes", async (req, res) => {
//   const notes = await Note.find();
//   res.json(notes);
// });

// app.get("/", (req, res) => {
//   res.send("Backend is working");
// });

// app.post("/notes", async (req, res) => {
//   const newNote = new Note(req.body);
//   await newNote.save();
//   res.json(newNote);
// });
// app.delete("/notes/:id", async (req, res) => {
//   try {
//     await Note.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Delete failed" });
//   }
// });
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(400).json({ message: "Invalid password" });

//   const token = jwt.sign(
//     { id: user._id },
//     "secretkey",
//     { expiresIn: "1d" }
//   );

//   res.json({ token });
// });
// const auth = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, "secretkey");
//     req.userId = decoded.id;
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   const user = new User({ email, password: hashed });
//   await user.save();

//   res.json({ message: "User created" });
// });
// app.put("/notes/:id", async (req, res) => {
//   try {
//     const updatedNote = await Note.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedNote);
//   } catch (error) {
//     res.status(500).json({ error: "Update failed" });
//   }
// });
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

// const User = mongoose.model("User", userSchema);
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= MODELS ================= */

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});

const Note = mongoose.model("Note", noteSchema);

/* ================= AUTH MIDDLEWARE ================= */

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.send("Backend is working");
});

/* Register */
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });

  await user.save();
  res.json({ message: "User created" });
});

/* Login */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* Protected Notes Routes */

app.get("/notes", auth, async (req, res) => {
  const notes = await Note.find({ userId: req.userId });
  res.json(notes);
});

app.post("/notes", auth, async (req, res) => {
  const note = new Note({
    ...req.body,
    userId: req.userId,
  });

  await note.save();
  res.json(note);
});

app.put("/notes/:id", auth, async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(updated);
});

app.delete("/notes/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  res.json({ message: "Deleted" });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));