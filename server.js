const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
let dataBase = require("./db/db.json");
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static middleware pointing to the public folder
app.use(express.static("public"));

// Create Express.js routes for default '/'
app.get("/", (req, res) => res.send("Navigate to /send or /routes"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "db/db.json"))
);

// POST route to add a new note with a unique ID
app.post("/api/notes", (req, res) => {
  console.log("line 29", req.body);

  const newNote = {
    id: uuidv4(), // Generate a unique ID
    title: req.body.title,
    text: req.body.text,
  };
  console.log("line 43", newNote);
  dataBase.push(newNote);

  console.log("line 46", dataBase)
  fs.writeFile("db/db.json", JSON.stringify(dataBase, null, 4), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\nData written to db.json`);
    }
  });
  res.json(dataBase)
});

// DELETE route to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  dataBase = dataBase.filter(({ id }) => id !== noteId)

  fs.writeFile(
    "db/db.json",
    JSON.stringify(dataBase, null, 4),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`\nNote with ID ${noteId} deleted from db.json`);
      }
    }
  );
  res.json(dataBase)
}
);


// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
