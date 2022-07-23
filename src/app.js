var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.status(201).json({ alive: true }).send();
});

module.exports = app;