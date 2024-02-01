const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('develop/public'));

// API Routes
app.get('/api/notes', (req, res) => {
  // Read the contents of db.json
  const notes = JSON.parse(fs.readFileSync('./develop/routes/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  // Read existing notes from db.json
  const notes = JSON.parse(fs.readFileSync('./develop/routes/db.json', 'utf8'));

  // Create a new note
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: Date.now().toString(), // Generate a unique id (you may want to use a more robust method)
  };

  // Add the new note to the array
  notes.push(newNote);

  // Write the updated notes array back to db.json
  fs.writeFileSync('./develop/routes/db.json', JSON.stringify(notes));

  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  // Read existing notes from db.json
  const notes = JSON.parse(fs.readFileSync('./develop/routes/db.json', 'utf8'));

  // Filter out the note with the given id
  const updatedNotes = notes.filter((note) => note.id !== noteId);

  // Write the updated notes array back to db.json
  fs.writeFileSync('./develop/routes/db.json', JSON.stringify(updatedNotes));

  res.json({ message: 'Note deleted' });
});

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop/public/note.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
