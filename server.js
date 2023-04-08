const express = require (`express`);
const path = require('path');
const fs = require('fs');
const notes = require(`./db/db.json`);
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express()

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//html get route to notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//get route for an individual note
app.get('/api/notes/:note_id', (req, res) => {
  // Coerce the specific search term to lowercase
  const noteId = req.params.id;

  // Iterate through the terms name to check if it matches `req.params.term`
  for (let i = 0; i < notes.length; i++) {
    if (noteId === notes[i].noteId) {
      return res.json(notes[i]);
    }
  }
});

//html get route to return api
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf-8', (err) => { if (err) console.log(err) });
  res.json(notes);
});

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/api/notes', (req, res) => {
  
    const { title, text } = req.body;
  
    if (title && text) {
  
      const newNote = {
        title,
        text,
        note_id: uuidv4()
      };

      notes.push(newNote);
      
    // readAndAppend(newNote, './db/db.json');
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => { if (err) console.log(err) });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
