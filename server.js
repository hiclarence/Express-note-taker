const express = require (`express`);
const path = require('path');
const fs = require('fs');
const notes = require(`./db/db.json`);

const PORT = 3001;
const app = express()


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    res.json(notes);
});

app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
