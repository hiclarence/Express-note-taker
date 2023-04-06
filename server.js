const express = require (`express`);
const path = require('path');
const fs = require('fs');
const notes = require(`./db/db.json`);
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const app = express()

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//html get route to notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//html get route to return api
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    res.json(notes);
});

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a notes`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuidv4()
      };
  
      // Convert the data to a string so we can save it
    //   const noteString = JSON.stringify(newNote);
  
    readAndAppend(newNote, './db/db.json');
  
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
