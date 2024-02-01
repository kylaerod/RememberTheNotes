const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data in the request body
app.use(express.json());

// Routes

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop', 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'develop', 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'develop', 'db', 'db.json'), 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'develop', 'db', 'db.json'), 'utf8'));
  notes.push(newNote);

  fs.writeFileSync(path.join(__dirname, 'develop', 'db', 'db.json'), JSON.stringify(notes, null, 2), 'utf8');

  res.json(newNote);
});


app.use('/assets', express.static(path.join(__dirname, 'develop', 'public', 'assets')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
