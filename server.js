var express = require("express");
var path = require("path");
var fs = require("fs");
var count = 0;

var app = express();
var PORT = process.env.PORT || 3000;

let notes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


app.get("/api/notes", function (req, res) {
  return res.json(notes);


});


app.post("/api/notes", function (req, res) {
  var newNote = req.body;

  console.log(newNote);

  newNote.id = ++count

  notes.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(notes), "utf8", function (err) {
    if (err) {
      return res.error(err);
    }
    res.json(newNote);
  });

});

app.delete("/api/notes/:id", function (req, res) {
  console.log(req.params.id);
  notes = notes.filter(note => note.id != req.params.id);

  fs.writeFile("./db/db.json", JSON.stringify(notes), "utf8", function (err) {
    if (err) {
      return res.error(err);
    }
    res.sendStatus(204);
  });
})

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});