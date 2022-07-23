var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.status(201).json({ alive: true }).send();
});

app.listen(3000, () => console.log("Server is running!"));

